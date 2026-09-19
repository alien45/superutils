package io.github.alien45.superutils.expobinarymodule

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log

/**
 * Restarts the binary after a reboot or an app update, so data stays
 * reachable without the user opening the app first.
 */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action ?: return
        val ignore = action != Intent.ACTION_BOOT_COMPLETED &&
            action != Intent.ACTION_LOCKED_BOOT_COMPLETED &&
            action != Intent.ACTION_MY_PACKAGE_REPLACED
        if (ignore) return

        val optionsJson = ConfigStore.get(context, START_OPTIONS_KEY) ?: return

        val options = try {
            optionsJson.toStartOptions()
        } catch (e: Exception) {
            Log.e(TAG, "BootReceiver: Failed to parse service options", e)
            null
        }
        if (options == null || !options.autoStart || options.binaryName.isBlank()) return

        Log.i(TAG, "Restarting binary after $action")

        val start = Intent(context, BinaryService::class.java).apply {
            putExtra(START_OPTIONS_KEY, optionsJson)
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(start)
        } else {
            context.startService(start)
        }
        // var attempts = 0
        // while (BinaryModule.instance == null && attempts < 20) {
        //     val service = BinaryService.LocalBinder?.getService()
        //     Log.d(TAG, "BinaryModule.instance: ${BinaryModule.instance != null} | service: ${service != null}")
        //     Thread.sleep(500)
        //     attempts++
        // }
       
        // if(BinaryModule.instance !== null) Log.i(TAG, "Restarting binary after $action ---------")
        // BinaryModule.instance?.start(optionsJson)
    }
}