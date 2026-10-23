/**
 * Fixed notification ID used for the persistent foreground service notification
 */
export const BINARY_NOTIFICATION_ID = 73370000

/** Tag used when sending device status as IPC message to the binary */
export const DEVICE_STATUS_TAG = '[BinaryModule][DeviceStatus]'

/**
 * Tag used to dynamically inject JNI libs directory path into the environment variables passed to the binary.
 *
 * Eg: `'[[DIR_JNI_LIBS]]/libMyService.so'` will be transformed into something like this:
 * `'/data/app/......./com.yourapp-......./lib/x86_64'`
 */
export const DIR_JNI_LIBS = '[[DIR_JNI_LIBS]]'

/**
 * Tag used to dynamically inject app files directory path into the environment variables passed to the binary.
 *
 * Eg:
 * `'[[DIR_APP_FILES]]/my-app-config.json'` will be transformed into
 * `'/storage/emulated/0/Android/data/com.yourapp/files/my-app-config.json'`
 */
export const DIR_APP_FILES = '[[DIR_APP_FILES]]'

/**
 * Used internally to generated incremental notification IDs (integer) for general notifications
 * related to the binary status
 * */
export const ID_PREFIX = '7337'
