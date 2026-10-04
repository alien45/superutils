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
        val tag = "${TAG}[BootReceiver]"
        val action = intent.action ?: return
        val ignore = action != Intent.ACTION_BOOT_COMPLETED &&
            action != Intent.ACTION_LOCKED_BOOT_COMPLETED &&
            action != Intent.ACTION_MY_PACKAGE_REPLACED
        if (ignore) return

        val optionsJson = EncryptedStore.get(context, START_OPTIONS_KEY) ?: return

        val options = try {
            optionsJson.toStartOptions()
        } catch (e: Exception) {
            Log.e(tag, "Failed to parse service options", e)
            null
        }
        if (options == null || !options.autoStart || options.binaryName.isBlank()) return
        if (BinaryService.status == Status.STARTED || BinaryService.status == Status.STARTING) {
            Log.e(tag, "Binary is already running. Skipping autostart.")
            return
        }

        if (options.autoStartDelay > 0) {
            Log.i(tag, "Delaying ${options.autoStartDelay} seconds before starting binary...")
            Thread.sleep(options.autoStartDelay * 1000)
        }

        Log.i(tag, "Restarting binary after $action")

        val start = Intent(context, BinaryService::class.java).apply {
            putExtra(START_OPTIONS_KEY, optionsJson)
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(start)
        } else {
            context.startService(start)
        }
    }
}