package io.github.alien45.superutils.expobinarymodule

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.os.Build
import android.os.Environment
import android.os.IBinder
import android.util.Log
import android.net.Uri
import android.provider.Settings
import android.Manifest
import android.content.pm.PackageManager
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import android.app.Activity

import expo.modules.core.interfaces.ActivityProvider
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

import java.time.Instant

class BinaryModule : Module() {

    private var service: BinaryService? = null
    // BinaryService binding state
    private var bound = false

    private var startOptions: StartOptions? = null

    companion object {
        var instance: BinaryModule? = null
        var notificationService: NotificationService? = null
        var deviceStatus: DeviceStatus? = null
    }

    private val connection = object: ServiceConnection {

        override fun onServiceConnected(name: ComponentName?, binder: IBinder?) {
            val localBinder = binder as? BinaryService.LocalBinder
                ?: return

            service = localBinder.getService()
            bound = true

            Log.d(TAG, "BinaryService connected")
        }

        override fun onServiceDisconnected(name: ComponentName?) {
            service = null
            bound = false

            Log.d(TAG, "BinaryService disconnected")
        }
    }

    override fun definition() = ModuleDefinition {
        Name("BinaryModule")
        Events("log", "notification", "device-status")

        OnCreate {
            Log.d(TAG, "BinaryModule onCreate")
            instance = this@BinaryModule

            val context: Context =
                appContext.reactContext?.applicationContext
                    ?: return@OnCreate

            val optionsJson = ConfigStore.get(context, START_OPTIONS_KEY)
            if (optionsJson != null) {
                startOptions = optionsJson.toStartOptions()

                // App started by user but binary hasn't yet started.
                // Or, when app is force closed and user opens the app manually.
                if (startOptions?.autoStart!! && BinaryService.status == Status.NEVER_STARTED) {
                    start(optionsJson)
                }
            }

            notificationService = service?.notificationService ?: NotificationService(context)
        }

        OnDestroy {
            instance = null
        }
        
        Function("emitLog") { emitLog: Boolean? ->
            if (emitLog != null) {
                BinaryService.emitLog = emitLog
            }

            BinaryService.emitLog
        }

        Function("getEnv") { ->
            BinaryService.exposedEnv
        }

        Function("getError") { ->
            BinaryService.error
        }

        Function("getLibsDirPath") { ->
            getLibsDirPath()
        }

        Function("getStartCount") { ->
            BinaryService.startCount
        }

        Function("getStatus") { ->
            BinaryService.status
        }

        Function("getStoragePath") { ->
            getReactContext().getExternalFilesDir(null)
        }

        Function("notificationSet") { options: NotificationOptions ->
            notificationService!!.show(options.text ?: "", options)
        }

        Function("notificationCancel") { id: Int ->
            notificationService!!.cancel(id)
        }

        Function("permissionCheck") { code: Int ->
            permissionCheck(code)
        }

        Function("permissionRequest") { code: Int ->
            permissionRequest(code)
        }

        Function("setAppState") { state: AppStateStatus ->
            BinaryService.appState = state
        }

        Function("setStartOptions") { options: StartOptions ->
            startOptions = options
            ConfigStore.set(getReactContext(), START_OPTIONS_KEY, options.toJson())
        }
        
        AsyncFunction("start") { options: StartOptions? ->
            startOptions = options ?: startOptions
            if (options == null) {
                throw IllegalStateException(
                    "Start options required"
                )
            }
            val binaryName = options.binaryName
            if (binaryName.isBlank()) {
                throw IllegalStateException(
                    "Binary name required"
                )
            }
            start(startOptions!!.toJson())
        }

        AsyncFunction("stop") {
            startOptions = null

            stop()
        }

        Function("storagePermissionCheck") {
            permissionCheck(STORAGE_PERMISSION_CODE)
        }

        AsyncFunction("storagePermissionRequest") {
            permissionRequest(STORAGE_PERMISSION_CODE)
        }
    }

    fun emitDeviceStatus(status: DeviceStatus) {
        val map = mapOf(
            "connected" to status.connected,
            "netCapabilityInternet" to status.netCapabilityInternet,
            "netCapabilityValidated" to status.netCapabilityValidated,
            "networkType" to status.networkType.value,

            "isAirplaneMode" to status.isAirplaneMode,
            "isMetered" to status.isMetered,
            "isMobileData" to status.isMobileData,
            "isWifi" to status.isWifi,

            "batteryCharging" to status.batteryCharging,
            "batteryLevel" to status.batteryLevel,
            "batteryFull" to status.batteryFull,
            "powerSaveMode" to status.powerSaveMode
        )
        val changed = deviceStatus?.checkChanged(status) ?: true
        if (!changed) return

        Log.d(TAG, "[Emit:device-status]: ${map}" )
        sendEvent("device-status", map)
        deviceStatus = status
    }

    fun emitLog(line: String) {
        Log.d(TAG, "[Emit:log]: ${line}" )
        sendEvent("log", mapOf(
            "line" to line,
            "timestamp" to Instant.now().toString()
        ))
    }

    fun emitNotification(notificationOptions: String) {
        Log.d(TAG, "[Emit:notification]: ${notificationOptions}" )
        sendEvent("notification", mapOf(
            "notification" to notificationOptions,
            "timestamp" to Instant.now().toString()
        ))
    }

    fun getLibsDirPath(): String {
        return getReactContext().applicationInfo.nativeLibraryDir 
    }
    
    private fun getReactContext(): Context {
        return appContext.reactContext
            ?: throw IllegalStateException(
                "No React context available"
            )
    }

    private fun permissionCheck(code: Int): Boolean {
        val context = appContext.reactContext
            ?: return false


        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && code == STORAGE_PERMISSION_CODE) {
            /**
             * Android 11+  → Environment.isExternalStorageManager()
             * Android ≤10  → WRITE_EXTERNAL_STORAGE
             */
            return Environment.isExternalStorageManager()
        }


        return ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
        ) == PackageManager.PERMISSION_GRANTED
    }

    private fun permissionRequest(code: Int): Boolean {
        if (permissionCheck(code)) {
            return true
        }

        val activity = appContext.currentActivity
            ?: throw IllegalStateException("No current activity available")

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && code == STORAGE_PERMISSION_CODE) {
            val intent = Intent(
                Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION,
                Uri.parse("package:${activity.packageName}")
            )

            activity.startActivity(intent)
        } else {
            ActivityCompat.requestPermissions(
                activity,
                arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE),
                STORAGE_PERMISSION_CODE
            )
        }

        return permissionCheck(code)
    }

    fun start(optionsJson: String): Status {
        Log.d(TAG, "start()")
        /*
        * Don't start another instance while the current service
        * is already starting or running.
        */
        if (BinaryService.status == Status.STARTED || BinaryService.status == Status.STARTING) {
            return BinaryService.status
        }

        val context = getReactContext()
        val intent = Intent(context, BinaryService::class.java).apply {
            putExtra(START_OPTIONS_KEY, optionsJson)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }

        /*
        * Bind so that stop() can directly access BinaryService
        * instead of sending a special Intent action.
        */
        bound = context.bindService(
            intent,
            connection,
            Context.BIND_AUTO_CREATE
        )
        return BinaryService.status
    }

    private fun stop() {
        Log.d(TAG, "stop() service: ${service == null}")

        (service ?: BinaryService.instance)?.stopProcess()

        if (bound) {
            appContext.reactContext?.unbindService(connection)
            bound = false
        }

        service = null
        var attempts = 0

        while (BinaryService.status != Status.STOPPED && attempts < 50) {
            Thread.sleep(100)
            attempts++
        }

        BinaryService.status
    }

}