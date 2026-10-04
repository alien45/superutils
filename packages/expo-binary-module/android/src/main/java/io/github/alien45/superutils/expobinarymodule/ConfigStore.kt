package io.github.alien45.superutils.expobinarymodule

import android.content.Context
import android.content.SharedPreferences

/**
 * Persistent key-value store for the binary service.
 * 
 *
 * Uses Device Protected Storage so values are available before the user
 * unlocks the device (e.g. LOCKED_BOOT_COMPLETED).
 */
object ConfigStore {
    private const val PREFERENCES_KEY = "superutils_expobinarymodule_configstore_key"
    private var sharedPreferences: SharedPreferences? = null

    private fun getPreferences(context: Context): SharedPreferences {
        if (sharedPreferences != null) return sharedPreferences!!

        val deviceContext = context.createDeviceProtectedStorageContext()
        // Migrate existing preferences from credential-protected storage if needed.
        deviceContext.moveSharedPreferencesFrom(
            context,
            PREFERENCES_KEY
        )
        sharedPreferences = deviceContext.getSharedPreferences(
            PREFERENCES_KEY,
            Context.MODE_PRIVATE
        )
        return sharedPreferences!!
    }

    /** Clear all items in the storage */
    fun clear(context: Context) {
        getPreferences(context)
            .edit()
            .clear()
            .apply()
    }

    /** Remove single value by key */
    fun delete(context: Context, key: String) {
        getPreferences(context)
            .edit()
            .remove(key)
            .apply()
    }

    /** Get item by key */
    fun get(context: Context, key: String): String? {
        return getPreferences(context).getString(key, null)
    }

    /** Save item by key */
    fun set(
        context: Context,
        key: String,
        value: String,
    ) {
        getPreferences(context)
            .edit()
            .putString(key, value)
            .apply()
    }
}