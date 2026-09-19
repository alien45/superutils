package io.github.alien45.superutils.expobinarymodule

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build

import androidx.core.app.NotificationCompat

class NotificationService(private val context: Context) {
    companion object {
        private const val CHANNEL_ID = "BinaryModule-NotificationService"

        const val ACTION = "io.github.alien45.superutils.expobinarymodule.NOTIFICATION_ACTION"
        const val EXTRA_ACTION_ID = "notification_action_id"
        const val EXTRA_ACTION_TITLE = "notification_action_title"
        const val EXTRA_ACTION_URI = "notification_action_uri"
    }

    public var defaultOptions: NotificationOptions? = null
    public var lastId: Int = 0

    init {
        createNotificationChannel()
    }

    fun buildNotification(
        text: String? = null,
        options: NotificationOptions? = defaultOptions,
    ): Notification {
        val appName = context.applicationInfo
            .loadLabel(context.packageManager)
            .toString()
            .replaceFirstChar { it.uppercase() }
        var defaults: NotificationOptions? = null
        if (options?.id != null && options?.id == defaultOptions?.id) {
            defaults = defaultOptions
        }

        options?.applyDefaults(defaults)
        val _text = text ?: options?.text
        val actions = options?.actions ?: emptyList()
        var clickAction = options?.clickAction
        val title = options?.title
        val ongoing = options?.ongoing!!

        return NotificationCompat.Builder(
            context,
            CHANNEL_ID
        )
            .setContentTitle(title)
            .setContentText(_text)
            .setStyle(
                NotificationCompat
                    .BigTextStyle()
                    .bigText(_text)
            )
            .setSubText(options?.subText)
            .setOngoing(ongoing)
            .setAutoCancel(!ongoing)
            .setSilent(options?.silent ?: false)
            .setSmallIcon(context.applicationInfo.icon)
            .apply {

                actions?.forEach { action ->
                    addAction(
                        NotificationCompat.Action.Builder(
                            0,
                            action.title,
                            createActionPendingIntent(action)
                        ).build()
                    )
                }

                clickAction?.let { action ->
                    createAppPendingIntent(action)?.let { pendingIntent ->
                        setContentIntent(pendingIntent)
                    }
                }

                options?.progress?.let { progress ->
                    setProgress(
                        progress.max,
                        progress.current,
                        progress.indeterminate
                    )
                }
            }
            .build()
    }

    fun cancel(notificationId: Int) {
        getNotificationManager().cancel(notificationId)
    }

    private fun createActionPendingIntent(
        action: NotificationAction
    ): PendingIntent {
        return if (action.id == "stop") {
            createServicePendingIntent(action)
        } else {
            createAppPendingIntent(action)
                ?: createServicePendingIntent(action)
        }
    }

    private fun createAppPendingIntent(
        action: NotificationAction
    ): PendingIntent? {
        val launchIntent = context.packageManager
            .getLaunchIntentForPackage(context.packageName)
            ?: return null

        launchIntent.addFlags(
            Intent.FLAG_ACTIVITY_NEW_TASK or
                Intent.FLAG_ACTIVITY_CLEAR_TOP or
                Intent.FLAG_ACTIVITY_SINGLE_TOP
        )
        launchIntent.putExtra(EXTRA_ACTION_ID, action.id)
        launchIntent.putExtra(EXTRA_ACTION_TITLE, action.title)
        launchIntent.putExtra(EXTRA_ACTION_URI, action.uri)

        // if uri is provided, open the app 
        action.uri?.let {
            launchIntent.data = Uri.parse(it)
        }

        return PendingIntent.getActivity(
            context,
            action.id.hashCode(),
            launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or
                PendingIntent.FLAG_IMMUTABLE
        )
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "binary_service_runner",
                NotificationManager.IMPORTANCE_LOW
            )

            getNotificationManager()
                .createNotificationChannel(channel)
        }
    }

    private fun createServicePendingIntent(
        action: NotificationAction
    ): PendingIntent {
        val intent = Intent(
            context,
            BinaryService::class.java
        ).apply {
            this.action = ACTION
            putExtra(EXTRA_ACTION_ID, action.id)
            putExtra(EXTRA_ACTION_TITLE, action.title)
            putExtra(EXTRA_ACTION_URI, action.uri)
        }

        return PendingIntent.getService(
            context,
            action.id.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or
                PendingIntent.FLAG_IMMUTABLE
        )
    }

    private fun getNotificationManager(): NotificationManager {
        return context.getSystemService(
            NotificationManager::class.java
        )
    }

    fun show(
        text: String? = null,
        options: NotificationOptions? = defaultOptions,
    ): Int {
        var id = options?.id ?: ++lastId
        getNotificationManager().notify(
            id,
            buildNotification(text, options)
        )
        return id
    }
}