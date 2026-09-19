package io.github.alien45.superutils.expobinarymodule

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.os.BatteryManager
import android.os.PowerManager
import android.util.Log
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class DeviceStatusMonitor(
    context: Context
) : AutoCloseable {

    private val appContext = context.applicationContext

    private val connectivityManager =
        appContext.getSystemService(ConnectivityManager::class.java)

    private val powerManager =
        appContext.getSystemService(PowerManager::class.java)

    private val _status = MutableStateFlow(
        DeviceStatus(
            powerSaveMode = powerManager.isPowerSaveMode
        )
    )

    val status: StateFlow<DeviceStatus> = _status.asStateFlow()
    private var isAirplaneMode = false
    private val networkCallback = object :
        ConnectivityManager.NetworkCallback() {

        override fun onAvailable(network: Network) {
            refreshNetworkStatus()
        }

        override fun onCapabilitiesChanged(
            network: Network,
            networkCapabilities: NetworkCapabilities
        ) {
            refreshNetworkStatus()
        }

        override fun onLinkPropertiesChanged(
            network: Network,
            linkProperties: android.net.LinkProperties
        ) {
            refreshNetworkStatus()
        }

        override fun onLost(network: Network) {
            if (!isAirplaneMode) refreshNetworkStatus()
        }
    }

    private val airplaneModeReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            if (intent.action != Intent.ACTION_AIRPLANE_MODE_CHANGED) return

            isAirplaneMode = intent.getBooleanExtra("state", false)
            if (isAirplaneMode) refreshNetworkStatus(true)
        }
    }

    private val batteryReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            updateBatteryStatus(intent)
        }
    }

    private val powerSaveReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            _status.value = _status.value.copy(
                powerSaveMode = powerManager.isPowerSaveMode
            )
        }
    }

    init {        
        connectivityManager.registerDefaultNetworkCallback(networkCallback)

        appContext.registerReceiver(
            batteryReceiver,
            IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        )

        appContext.registerReceiver(
            powerSaveReceiver,
            IntentFilter(PowerManager.ACTION_POWER_SAVE_MODE_CHANGED)
        )

        appContext.registerReceiver(
            airplaneModeReceiver,
            IntentFilter(Intent.ACTION_AIRPLANE_MODE_CHANGED)
        )

        refreshNetworkStatus()

        // ACTION_BATTERY_CHANGED is a sticky broadcast. This gets
        // the current battery state immediately.
        val batteryIntent = appContext.registerReceiver(
            null,
            IntentFilter(Intent.ACTION_BATTERY_CHANGED)
        )

        if (batteryIntent != null) {
            updateBatteryStatus(batteryIntent)
        }
    }

    private fun refreshNetworkStatus(airmode: Boolean? = false) {
        val network = connectivityManager.activeNetwork
        val capabilities =
            network?.let(connectivityManager::getNetworkCapabilities)

        if (capabilities == null) {
            _status.value = _status.value.copy(
                connected = false,
                netCapabilityInternet = false,
                netCapabilityValidated = false,
                networkType = DeviceNetworkType.NONE,
                
                isAirplaneMode = isAirplaneMode,
                isMetered = false,
                isWifi = false,
                isMobileData = false
            )
            return
        }

        val isWifi = capabilities.hasTransport(
            NetworkCapabilities.TRANSPORT_WIFI
        )

        val isCellular = capabilities.hasTransport(
            NetworkCapabilities.TRANSPORT_CELLULAR
        )

        val networkType = when {
            isWifi -> DeviceNetworkType.WIFI

            isCellular -> DeviceNetworkType.CELLULAR

            capabilities.hasTransport(
                NetworkCapabilities.TRANSPORT_ETHERNET
            ) -> DeviceNetworkType.ETHERNET

            capabilities.hasTransport(
                NetworkCapabilities.TRANSPORT_VPN
            ) -> DeviceNetworkType.VPN

            else -> DeviceNetworkType.OTHER
        }

        val isMetered = !capabilities.hasCapability(
            NetworkCapabilities.NET_CAPABILITY_NOT_METERED
        )
        val netCapabilityInternet = capabilities.hasCapability(
            NetworkCapabilities.NET_CAPABILITY_INTERNET
        )
        val netCapabilityValidated = capabilities.hasCapability(
            NetworkCapabilities.NET_CAPABILITY_VALIDATED
        )

        _status.value = _status.value.copy(
            connected = !isAirplaneMode && netCapabilityInternet && netCapabilityValidated,
            netCapabilityInternet = netCapabilityInternet,
            netCapabilityValidated = netCapabilityValidated,
            networkType = networkType,

            isAirplaneMode = isAirplaneMode ?: false,
            isMetered = isMetered,
            isWifi = isWifi,
            isMobileData = isCellular
        )
    }

    private fun updateBatteryStatus(intent: Intent) {
        val level = intent.getIntExtra(
            BatteryManager.EXTRA_LEVEL,
            -1
        )

        val scale = intent.getIntExtra(
            BatteryManager.EXTRA_SCALE,
            100
        )

        val batteryLevel =
            if (level >= 0 && scale > 0) {
                (level * 100 / scale).coerceIn(0, 100)
            } else {
                -1
            }

        val batteryStatus = intent.getIntExtra(
            BatteryManager.EXTRA_STATUS,
            BatteryManager.BATTERY_STATUS_UNKNOWN
        )

        val batteryCharging =
            batteryStatus == BatteryManager.BATTERY_STATUS_CHARGING ||
                batteryStatus == BatteryManager.BATTERY_STATUS_FULL

        _status.value = _status.value.copy(
            batteryCharging = batteryCharging,
            batteryLevel = batteryLevel,
            batteryFull = batteryStatus == BatteryManager.BATTERY_STATUS_FULL
        )
    }

    override fun close() {
        connectivityManager.unregisterNetworkCallback(networkCallback)
        appContext.unregisterReceiver(batteryReceiver)
        appContext.unregisterReceiver(powerSaveReceiver)
        appContext.unregisterReceiver(airplaneModeReceiver)
    }
}
