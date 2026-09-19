package io.github.alien45.superutils.expobinarymodule

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import io.github.lukmccall.pika.Introspectable

import org.json.JSONObject

import com.google.gson.Gson

val gson = Gson()

enum class AppStateStatus(val value: String) {
    ACTIVE("active"),
    BACKGROUND("background"),
    INACTIVE("inactive"),
    UNKNOWN("unknown"),
    EXTENSION("extension"),
}

@Introspectable
class AutoStopOptions: Record {
    @Field
    var airplaneMode: Boolean = false

    @Field
    var batteryLevelBelow: Int = 10

    @Field
    var batteryNotCharging: Boolean = false
    
    @Field
    var metered: Boolean = false

    // this field covers: connected | isMobileData | isWifi |...
    @Field
    var networkTypes: List<DeviceNetworkType> = listOf(DeviceNetworkType.CELLULAR)
    
    @Field
    var powerSaveMode: Boolean = false
}

data class DeviceStatus(
    val batteryCharging: Boolean = false,
    val batteryLevel: Int = -1,
    val batteryFull: Boolean = false,

    // netCapabilityInternet = true & netCapabilityValidated = true.
    // Source:  https://developer.android.com/reference/android/net/NetworkCapabilities
    val connected: Boolean = false, 

    val isAirplaneMode: Boolean = false,
    val isMetered: Boolean = false,
    val isMobileData: Boolean = false,
    val isWifi: Boolean = false,

    val netCapabilityInternet: Boolean = false, // `NET_CAPABILITY_INTERNET`
    val netCapabilityValidated: Boolean = false, //`NET_CAPABILITY_VALIDATED`
    val networkType: DeviceNetworkType = DeviceNetworkType.NONE,

    val powerSaveMode: Boolean = false
)
fun DeviceStatus.checkChanged(
    newStatus: DeviceStatus? = null
): Boolean {
    val changed = newStatus?.let{
        return connected != it.connected ||
            netCapabilityInternet != it.netCapabilityInternet ||
            netCapabilityValidated != it.netCapabilityValidated ||
            networkType != it.networkType ||
            isAirplaneMode != it.isAirplaneMode ||
            isMetered != it.isMetered ||
            isMobileData != it.isMobileData ||
            isWifi != it.isWifi ||
            batteryCharging != it.batteryCharging ||
            batteryLevel != it.batteryLevel ||
            batteryFull != it.batteryFull ||
            powerSaveMode != it.powerSaveMode
    }
    return changed ?: false
}

enum class DeviceNetworkType(val value: String) {
    CELLULAR("cellular"),
    ETHERNET("ethernet"),
    NONE("none"), // default
    OTHER("other"),
    VPN("vpn"),
    WIFI("wifi")
}

@Introspectable
class EnvEntry: Record {
    @Field
    var value: String = ""

    @Field
    var binaryOnly: Boolean = false

    @Field
    var random: Boolean = false

    @Field
    var length: Int? = 32
    
    @Field
    var encode: Boolean? = false

    @Field
    var prefix: String = ""
}

@Introspectable
class IpcOptions: Record {
    @Field
    var notifyOnAppStates: List<AppStateStatus> = listOf(
        AppStateStatus.BACKGROUND,
        AppStateStatus.INACTIVE,
        AppStateStatus.UNKNOWN,
        AppStateStatus.EXTENSION,
    )

    @Field
    var tag: String = ""
}

@Introspectable
class ProgressOptions: Record {
    @Field
    var current: Int = 0

    @Field
    var max: Int = 100

    @Field
    var indeterminate: Boolean = false
}

@Introspectable
class NotificationAction: Record {
    @Field
    var id: String = ""

    @Field
    var title: String = ""

    @Field
    var uri: String? = null
}

@Introspectable
class NotificationOptions: Record {
    @Field
    var actions: List<NotificationAction>? = null

    @Field
    var clickAction: NotificationAction? = null

    @Field
    var id: Int? = null

    // only used for IPC notification
    @Field
    var ignore: Boolean? = false

    @Field
    var ongoing: Boolean = false

    @Field
    var progress: ProgressOptions? = null

    @Field
    var silent: Boolean = false

    @Field
    var subText: String? = null

    @Field
    var text: String? = null

    @Field
    var title: String? = null
}
fun NotificationOptions.applyDefaults(
    defaults: NotificationOptions? = null
): NotificationOptions {
    defaults?.let {
        actions = actions ?: it.actions
        clickAction = clickAction ?: it.clickAction
        id = id ?: it.id
        progress = progress ?: it.progress
        subText = subText ?: it.subText
        text = text ?: it.text
        title = title ?: it.title
    }

    return this
}
fun String.toNotificationOptions(): NotificationOptions =
    gson.fromJson(this, NotificationOptions::class.java)

@Introspectable
class StartOptions: Record {
    @Field
    var autoStart: Boolean = false

    @Field
    var autoStop: AutoStopOptions? = AutoStopOptions()
    
    @Field
    var binaryName: String = ""

    /** Configuration and values for environment variables */
    @Field
    var env: Map<String, EnvEntry> = emptyMap()

    @Field
    var ipcOptions: IpcOptions? = null

    @Field
    var notification: NotificationOptions? = null

    /** If set, `start()` function will wait until provided text is printed by the binary */
    @Field
    var startupText: String? = null

    /** Duration in seconds.  */
    @Field
    var startupTimeout: Long = 30
}
fun StartOptions.toJson(): String =
    gson.toJson(this)
fun String.toStartOptions(): StartOptions =
    gson.fromJson(this, StartOptions::class.java)

enum class Status(val value: String) {
    CRASHED("crashed"),
    INVALID_OPTIONS("invalid_options"),
    NEVER_STARTED("never_started"),
    STARTED("started"),
    STARTING("starting"),
    STOPPING("stopping"),
    STOPPED("stopped")
}
