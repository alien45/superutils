package io.github.alien45.superutils.expobinarymodule

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.os.Build
import android.system.Os
import android.system.OsConstants
import android.system.ErrnoException
import android.util.Base64
import android.util.Log

import android.content.Context

import java.io.File
import java.security.SecureRandom
// import java.util.concurrent.AtomicBoolean // incorrect path
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch

val JNI_LIBS_DIR = "[[JNI_LIBS_DIR]]"

/**
 * Generic foreground service that runs a single binary from
 * nativeLibraryDir with a configurable environment.
 *
 * Configuration arrives through the start Intent as StartOptions JSON.
 * When autoStart is enabled, the configuration is also persisted so
 * Android can restart the service after process/service termination.
 */
class BinaryService : Service() {

    companion object {
        /** App/UI status: must be updated from the React Native side */
        @Volatile
        var appState: AppStateStatus? = null

        @Volatile
        var emitLog: Boolean = false

        @Volatile
        var error: String? = null
            private set

        /**
         * Contains environment values where `binaryOnly == false`.
         */
        @Volatile
        var exposedEnv: Map<String, String> = emptyMap()
            private set

        @Volatile
        var instance: BinaryService? = null

        /**
         * Number of times binary has started since the app launched.
         * Can be useful to check if there were any crashes causing auto-restart
         */
        @Volatile
        var startCount: Int = 0
            private set

        @Volatile
        var status: Status = Status.NEVER_STARTED
            private set

        @Volatile
        var startOptions: StartOptions? = null
            private set

            
    }

    private lateinit var deviceStatusMonitor: DeviceStatusMonitor
    private val serviceScope = CoroutineScope(
        SupervisorJob() + Dispatchers.Main.immediate
    )

    private var process: Process? = null

    public lateinit var notificationService: NotificationService

    private val binder = LocalBinder()

    inner class LocalBinder : android.os.Binder() {
        fun getService(): BinaryService = this@BinaryService
    }

    private fun generateRandomValue(length: Int? = 32, encode: Boolean?  = false): String {
        val bytes = ByteArray(length!!/2)

        SecureRandom().nextBytes(bytes)

        if (encode == true) return Base64.encodeToString(
            bytes,
            Base64.URL_SAFE or
                Base64.NO_WRAP or
                Base64.NO_PADDING
        )
        
         return bytes.joinToString("") { "%02x".format(it) }        
    }

    private fun getPid(proc: Process): Int? = try {
        val field = proc.javaClass.getDeclaredField("pid")
        field.isAccessible = true
        field.getInt(proc)
    } catch (e: Exception) {
        Log.w(TAG, "Failed to read process pid via reflection: ${e.message}")
        null
    }

    private fun handleDeviceStatus(status: DeviceStatus) {
        val aso = startOptions?.autoStop
        if (startOptions == null || aso == null) return

        val batLevel = aso.batteryLevelBelow
        val stop = aso.airplaneMode && status.isAirplaneMode ||
            (batLevel > 0 && status.batteryLevel <= batLevel) ||
            (aso.batteryNotCharging && !status.batteryCharging ) ||
            (aso.metered && status.isMetered) ||
            (aso.networkTypes.size > 0 && status.networkType in aso.networkTypes) ||
            (aso.powerSaveMode && status.powerSaveMode)
        val status = BinaryService.status
        if (stop) {
            // already stopping or stopped
            if (status in listOf(Status.STOPPING, Status.STOPPED)) return
            stopProcess()
            return
        }

        // already starting or started
        if (status in listOf(Status.STARTING, Status.STARTED)) return

        onStartCommand(null, 0, 0)
    }

    /** Check if binary log contains tag and handle notification  */
    private fun handleLogIpc(line: String, tag: String, notifyOnAppStates: List<AppStateStatus>) {
        if (tag == "" || !line.contains(tag, ignoreCase = true)) return 

        try {
            val jsonStr = line.split(tag)[1].trim()
            val notificationOptions = jsonStr.toNotificationOptions()
            if (notificationOptions.clickAction == null){
                // by default open the app if no clickAction is set
                notificationOptions.clickAction = NotificationAction().apply {
                    id = "open"
                    title = "open"
                }
            }
            // emit notification event
            if (notificationOptions.ignore!! != true) {
                BinaryModule.instance?.emitNotification(jsonStr)
            }

            if (notifyOnAppStates?.contains(appState)!! == true) {
                notificationService?.show(null, notificationOptions)
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to parse notification options.", e)
        }
    }

    override fun onBind(intent: Intent?): IBinder {
        return binder
    }

    override fun onCreate() {
        super.onCreate()

        Log.d(TAG, "BinaryService: oncreate")

        instance = this
        notificationService = BinaryModule.notificationService ?: NotificationService(this)

        deviceStatusMonitor = DeviceStatusMonitor(this)
        serviceScope.launch {
            deviceStatusMonitor.status.collect { status ->
                BinaryModule.instance?.emitDeviceStatus(status)
                handleDeviceStatus(status)
            }
        }
    }

    override fun onDestroy() {
        Log.d(TAG, "onDestroy")

        instance = null
        process?.destroy()
        process = null
        exposedEnv = emptyMap()

        if (status != Status.STOPPED) {
            status = Status.CRASHED
        }

        // cleanup device status monitor
        if (::deviceStatusMonitor.isInitialized) {
            deviceStatusMonitor.close()
        }

        serviceScope.cancel()
        super.onDestroy()
    }

    override fun onStartCommand(
        intent: Intent?,
        flags: Int,
        startId: Int
    ): Int {
        Log.d(TAG, "onStartCommand")

        if (intent?.action == NotificationService.ACTION) {
            when (intent.getStringExtra(NotificationService.EXTRA_ACTION_ID)) {
                "stop" -> stopProcess()
            }

            return START_NOT_STICKY
        }

        /*
         * Don't launch another process if this service is already running.
         */
        if (
            status == Status.STARTED &&
            process?.isAlive == true
        ) return START_NOT_STICKY

        status = Status.STARTING

        /*
         * START_STICKY may cause Android to restart the service with a
         * null Intent. Restore the persisted configuration in that case.
         */
        val optionsJson = intent
            ?.getStringExtra(START_OPTIONS_KEY)
            ?: ConfigStore.get(this, START_OPTIONS_KEY)
            ?: return START_NOT_STICKY

        val options = try {
            optionsJson.toStartOptions()
        } catch (e: Exception) {
            error = "Failed to parse service options"
            Log.e(TAG, error, e)

            status = Status.INVALID_OPTIONS
            stopSelf()

            return START_NOT_STICKY
        }

        startOptions = options

        val binaryName = options.binaryName
        Log.d(TAG, "starting binary $binaryName")
        Log.d(TAG, "StartOptions: ${options}")
        if (binaryName.isBlank()) {
            error = "Binary required"
            Log.e(TAG, error!!)

            status = Status.INVALID_OPTIONS
            stopSelf()

            return START_NOT_STICKY
        }

        val autoStart = options.autoStart
        val env = options.env
        val notification = options.notification ?: NotificationOptions()
        val ipcOptions = options.ipcOptions ?: IpcOptions()
        val startupText = options.startupText
        val startupTimeout = options.startupTimeout
        if (notification.title == null || notification.title == "") {
            val context = this
            val appName = context.applicationInfo
                .loadLabel(context.packageManager)
                .toString()
            notification.title = "$appName: Foreground Service"
        }
        notification.ongoing = notification.ongoing ?: true
        notification.id = notification.id ?: DEFAULT_NOTIFICATION_ID
        notificationService.defaultOptions = notification
        notificationService.lastId = notification.id!!
        startForeground(
            notification.id!!,
            notificationService.buildNotification("Starting…")
        )

        /*
         * Persist only when automatic restarting is enabled.
         */
        if (autoStart) {
            ConfigStore.set(this, START_OPTIONS_KEY, options.toJson())
        } else {
            ConfigStore.delete(this, START_OPTIONS_KEY)
        }

        try {
            error = null
            var started = startProcess(
                binaryName,
                env,
                startupText,
                startupTimeout,
                ipcOptions!!
            )
        } catch (e: Exception) {
            status = Status.CRASHED
            error = "Failed to launch binary"
            Log.e(TAG, error, e)

            error = "${error}: ${e.message}"

            stopForeground(STOP_FOREGROUND_REMOVE)
            notificationService.cancel(notificationService?.defaultOptions?.id!!)
        }

        return if (autoStart) {
            START_STICKY
        } else {
            START_NOT_STICKY
        }
    }

    private fun startProcess(
        binaryName: String,
        env: Map<String, EnvEntry>,
        startupText: String? = null,
        startupTimeout: Long = 30,
        ipcOptions: IpcOptions = IpcOptions()
    ): Boolean {
        Log.d(TAG, "starting process...")

        status = Status.STARTING
        val nativeLibDir = applicationInfo.nativeLibraryDir
        val bin = File(nativeLibDir, binaryName)

        if (!bin.exists()) {
            throw IllegalStateException(
                "Binary file '$binaryName' not found for ABI " +
                    "${Build.SUPPORTED_ABIS.firstOrNull()} at $nativeLibDir"
            )
        }

        val resolvedEnv = mutableMapOf<String, String>()
        val exposed = mutableMapOf<String, String>()

        for ((key, config) in env) {
            var resolvedValue = if (config.random) {
                "${config.prefix}${generateRandomValue(config.length, config.encode)}"
            } else {
                config.value
            }

            if (resolvedValue.contains(JNI_LIBS_DIR)) {
                resolvedValue = resolvedValue.replace(JNI_LIBS_DIR, nativeLibDir)
            }
            resolvedEnv[key] = resolvedValue

            if (!config.binaryOnly) {
                exposed[key] = resolvedValue
            }
        }

        val pb = ProcessBuilder(bin.absolutePath).apply {
            environment().putAll(resolvedEnv)
            redirectErrorStream(true)
        }
        val startedProcess = pb.start()

        process = startedProcess
        exposedEnv = exposed

        val startupLatch = CountDownLatch(1)
        val startupSucceeded = AtomicBoolean(false)
        val runningText = notificationService?.defaultOptions?.text ?: "Running"
        val logTag = ipcOptions.tag ?: ""
        val notifyOnAppStates = ipcOptions.notifyOnAppStates

        Thread {
            try {
                startedProcess.inputStream.bufferedReader().useLines { lines ->
                    for (line in lines) {
                        if (emitLog) BinaryModule.instance?.emitLog(line)
                        Log.d("${TAG}[BinaryLog]", line)
                        
                        handleLogIpc(line, logTag, notifyOnAppStates)
                        
                        val ignore = startupText === null || 
                            !line.contains(startupText, ignoreCase = true)
                        if (ignore) continue

                        if (process === startedProcess && status == Status.STARTING) {
                            startupSucceeded.set(true)
                            status = Status.STARTED
                            notificationService.show(runningText)
                        }
                        startupLatch.countDown()
                    }
                }

                val exitCode = startedProcess.waitFor()
                val crashed = process === startedProcess &&
                    status != Status.STOPPING &&
                    status != Status.STOPPED
                if (crashed) {
                    process = null
                    exposedEnv = emptyMap()
                    status = Status.CRASHED

                    error = "Binary exited with code $exitCode"
                    Log.e(TAG, error!!)

                    notificationService.show("Crashed")
                }

                startupLatch.countDown()
            } catch (e: InterruptedException) {
                Thread.currentThread().interrupt()
                startupLatch.countDown()
            } catch (e: Exception) {
                if (status !== Status.STOPPING && status !== Status.STOPPED) {
                    error = "Error reading binary output"
                    Log.e(TAG, error, e)
                }
                startupLatch.countDown()
            }
        }.start()

        if (startupText == null) {
            status = Status.STARTED

            notificationService.show(runningText)
            startupLatch.countDown()

            return true
        }

        val signaled = startupLatch.await(startupTimeout, TimeUnit.SECONDS)

        if (!signaled) {
            error = error ?: "Binary startup timed out"
            status = Status.CRASHED
            Log.e(TAG, error!!)

            notificationService.show(error!!)

            if (process === startedProcess) {
                startedProcess.destroy()
                process = null
                exposedEnv = emptyMap()
            }
        }

        return startupSucceeded.get()
    }

    /**
     * Stops the running binary and the Android service.
     *
     * Called directly by BinaryModule through the bound service instance.
     */
    fun stopProcess() {
        Log.d(TAG, "stopping process..")

        status = Status.STOPPING
        notificationService.show("Stopping…")

        val proc = process
        process = null
        exposedEnv = emptyMap()

        if (proc != null) {
            val pid = getPid(proc)

            if (pid != null) {
                android.os.Process.sendSignal(pid, 15) // SIGTERM — lets gateway run its shutdown handler
            } else {
                Log.w(TAG, "Could not resolve pid, falling back to destroy()")
                proc.destroy() // SIGKILL on Android, but guarantees termination
            }

            Thread {
                val exitedGracefully = try {
                    proc.waitFor(7, TimeUnit.SECONDS)
                } catch (e: InterruptedException) {
                    Thread.currentThread().interrupt()
                    false
                }

                if (!exitedGracefully) {
                    Log.w(TAG, "Gateway did not exit after SIGTERM, forcing kill")
                    proc.destroyForcibly()
                }
            }.start()
        }

        status = Status.STOPPED
        stopForeground(STOP_FOREGROUND_REMOVE)
        notificationService.cancel(notificationService?.defaultOptions?.id!!)
        Log.d(TAG, "stopped process")
    }
}