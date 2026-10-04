package io.github.alien45.superutils.expobinarymodule

import android.content.Context
import android.content.SharedPreferences
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import java.nio.charset.StandardCharsets
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Persistent encrypted key-value store.
 *
 * Uses Device Protected Storage so values are available before the user
 * unlocks the device, for example during LOCKED_BOOT_COMPLETED.
 */
object EncryptedStore {
    private const val KEY_ALIAS = "superutils_expobinarymodule_encryptedstore_key"

    // This is the new file containing encrypted values.
    private const val ENCRYPTED_PREFERENCES_KEY =
        "secure_preferences_encrypted"

    private const val TRANSFORMATION =
        "AES/GCM/NoPadding"

    private const val GCM_TAG_LENGTH_BITS = 128

    @Volatile
    private var sharedPreferences: SharedPreferences? = null

    private fun storageContext(context: Context): Context {
        return context.applicationContext
            .createDeviceProtectedStorageContext()
    }

    private fun getPreferences(context: Context): SharedPreferences {
        sharedPreferences?.let { return it }

        return synchronized(this) {
            sharedPreferences?.let { return@synchronized it }

            val storageContext = storageContext(context)

            sharedPreferences = storageContext.getSharedPreferences(
                ENCRYPTED_PREFERENCES_KEY,
                Context.MODE_PRIVATE
            )

            sharedPreferences!!
        }
    }

    private fun getOrCreateKey(): SecretKey {
        val keyStore = KeyStore.getInstance("AndroidKeyStore").apply {
            load(null)
        }

        val existingKey = keyStore.getKey(KEY_ALIAS, null)
        if (existingKey is SecretKey) {
            return existingKey
        }

        val keyGenerator = KeyGenerator.getInstance(
            KeyProperties.KEY_ALGORITHM_AES,
            "AndroidKeyStore"
        )

        val spec = KeyGenParameterSpec.Builder(
            KEY_ALIAS,
            KeyProperties.PURPOSE_ENCRYPT or
                KeyProperties.PURPOSE_DECRYPT
        )
            .setKeySize(256)
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(
                KeyProperties.ENCRYPTION_PADDING_NONE
            )
            // Do not require the user to unlock the device.
            // This is needed for direct-boot use cases.
            .setUnlockedDeviceRequired(false)
            .build()

        keyGenerator.init(spec)

        return keyGenerator.generateKey()
    }

    private fun encrypt(value: String): String {
        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(Cipher.ENCRYPT_MODE, getOrCreateKey())

        val iv = cipher.iv
        val ciphertext = cipher.doFinal(
            value.toByteArray(StandardCharsets.UTF_8)
        )

        val encodedIv = Base64.encodeToString(iv, Base64.NO_WRAP)
        val encodedCiphertext =
            Base64.encodeToString(ciphertext, Base64.NO_WRAP)

        return "$encodedIv:$encodedCiphertext"
    }

    private fun decrypt(storedValue: String): String {
        val separatorIndex = storedValue.indexOf(':')

        require(separatorIndex > 0) {
            "Invalid encrypted value"
        }

        val encodedIv = storedValue.substring(0, separatorIndex)
        val encodedCiphertext =
            storedValue.substring(separatorIndex + 1)

        val iv = Base64.decode(encodedIv, Base64.NO_WRAP)
        val ciphertext =
            Base64.decode(encodedCiphertext, Base64.NO_WRAP)

        val cipher = Cipher.getInstance(TRANSFORMATION)

        val parameterSpec = GCMParameterSpec(
            GCM_TAG_LENGTH_BITS,
            iv
        )

        cipher.init(
            Cipher.DECRYPT_MODE,
            getOrCreateKey(),
            parameterSpec
        )

        return String(
            cipher.doFinal(ciphertext),
            StandardCharsets.UTF_8
        )
    }

    /** Removes all encrypted values. */
    fun clear(context: Context) {
        getPreferences(context)
            .edit()
            .clear()
            .apply()
    }

    suspend fun clearAsync(context: Context) {
        withContext(Dispatchers.IO) {
            clear(context)
        }
    }

    /** Removes one value. */
    fun delete(context: Context, key: String) {
        getPreferences(context)
            .edit()
            .remove(key)
            .apply()
    }

    suspend fun deleteAsync(
        context: Context,
        key: String
    ) {
        withContext(Dispatchers.IO) {
            delete(context, key)
        }
    }

    /** Gets one decrypted value. */
    fun get(context: Context, key: String): String? {
        val storedValue = getPreferences(context).getString(key, null)
            ?: return null

        return decrypt(storedValue)
    }
 
    suspend fun getAsync(
        context: Context,
        key: String
    ): String? = withContext(Dispatchers.IO) {
        get(context, key)
    }

    /** Encrypts and stores one value. */
    fun set(
        context: Context,
        key: String,
        value: String
    ) {
        getPreferences(context)
            .edit()
            .putString(key, encrypt(value))
            .apply()
    }

    suspend fun setAsync(
        context: Context,
        key: String,
        value: String
    ) {
        withContext(Dispatchers.IO) {
            set(context, key, value)
        }
    }
}
