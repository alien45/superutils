import { NativeModule } from 'expo'
import type { AppStateStatus } from 'react-native'
import type { EnvEntry } from './env'
import type { NotificationManager, NotificationOptions } from './notification'
import type { StartOptions, Status } from './startOptions'
import type { Store } from './store'

export declare class BinaryModule extends NativeModule<BinaryModuleEvents> {
	/**
	 * Get/Set/update `emitLog` flag.
	 *
	 * If enabled, each line of stdout log from the binary will be emitted as they appear with event named "log".
	 *
	 * **CAUTION:** make sure to disable it when logs are no longer needed. If you only need to receive notifications
	 * use {@link StartOptions.ipcOptions} when starting the binary.
	 *
	 * Default: `undefined`
	 *
	 * #### Subscribe to log events:
	 * ```
	 * binaryModule.emitLog(true)
	 * binaryModule.addListener('log', data => {
	 * 	console.log('log', data)
	 * })
	 * ```
	 */
	emitLog: (emitLog?: boolean) => boolean

	/** Get exposed environment variables */
	getEnv: () => object

	/** Get most recent binary startup error message */
	getError: () => string | null

	/**
	 * Get path of the native library directory where the executable binaries (from `jniLibs` in Android) are stored
	 * for the current device where the app is running.
	 *
	 * Eg: /data/app/~~.......==/com.your.app-......==/lib/<ARCH>
	 *
	 * `ARCH` here refers to one of the following:
	 * - `arm64-v8a`: most modern smartphones
	 * - `x86_64`: devices or most of the emulators running on X86 64 bit
	 * - `armeabi-v7a`: older Arm based devices
	 * - `x86`: older x86 based devices
	 *
	 * **CAUTION: the path returned is not a permanent path and may change on app/device restart/reinstall.
	 * See {@link EnvEntry} for more details.**
	 *
	 *
	 */
	getLibsDirPath: () => string

	/**
	 * Get the number of times binary has started since the app launched.
	 * Can be useful to check if there were any crashes causing auto-restart.
	 */
	getStartCount: () => number

	/** Get binary/foreground service status */
	getStatus: () => Status

	/**
	 * Get app files storage directory path
	 *
	 * Eg: `"/storage/emulated/0/Android/data/app.package.name/files"`
	 */
	getStoragePath: () => string

	notification: NotificationManager

	/**
	 * Check if app has device permission (eg: storage access code)
	 *
	 * @param permission Android permission string eg: `"Manifest.permission.WRITE_EXTERNAL_STORAGE"`.
	 */
	permissionCheck: (permission: string) => boolean

	/**
	 * Request one or more device permissions
	 *
	 * @param permission Android permission string eg: `"Manifest.permission.WRITE_EXTERNAL_STORAGE"`.
	 * To request multiple permission in one go use comma-separated string
	 * @param code any number for self reference
	 */
	permissionRequest: (permission: string, code: number) => boolean

	/**
	 * Send a message to the binary's input stream.
	 */
	sendToBinary: (mesasge: string) => boolean

	/**
	 * Update current app status
	 *
	 * PS: Binary module will auto update the app state. Only use this if you would like to manually trigger a change
	 * if IPC notifictation should be triggered.
	 */
	setAppState: (status: AppStateStatus) => void

	/**
	 * Start binary (if not already started)
	 *
	 * @param options Persistent options used to start the binary. See {@link StartOptions} for more details.
	 *
	 * @retuns binary status
	 */
	start: (options: StartOptions) => Promise<Status>

	/**
	 * Get/Set start options
	 * If the binary has not been previously started, this will NOT start the binary.
	 *
	 * If the binary has already been running or stopped using auto-stop options,
	 * auto-stop options come into effect on the next device status change.
	 */
	startOptions: (options?: Partial<StartOptions>) => StartOptions | null

	/** Stop the binary, foreground service and close persistent notification*/
	stop: () => Promise<void>

	/** Check if app has read/write permission to external storage */
	storagePermissionCheck: () => boolean

	/**
	 * Request access to read and write to external storage.
	 * Your Android manifest file (`expo.android.permissions` in Expo `app.json`)
	 * must include the following permissions:
	 *
	 * - **Android 11+**: `MANAGE_EXTERNAL_STORAGE`
	 * - **Android ≤10**: `WRITE_EXTERNAL_STORAGE` & `READ_EXTERNAL_STORAGE`
	 *
	 * @param code any number for self reference
	 */
	storagePermissionRequest: (code: number) => Promise<boolean>

	/**
	 * Simple unencrypted app-private storage using Android SharedPreferences.
	 *
	 * Data may be backed up uncrypted or unencrypted by Android backup depending on the backup provider.
	 *
	 * You can also exclude it from backup: https://developer.android.com/identity/data/autobackup.
	 *
	 * For encrypted data use {@link BinaryModule.storeEncrypted}
	 */
	store: Store

	/**
	 * Simple encrypted storage using Android Keystore and SharedPreferences.
	 */
	storeEncrypted: Store & {
		deleteAsync: (key: string) => Promise<null>
		getAsync: (key: string) => Promise<string | null>
		setAsync: (key: string, value: string) => Promise<string | null>
	}
}

export type BinaryModuleEvents = {
	/**
	 * Emits each log output stream line by line from the binary.
	 *
	 * Event emitted only when enabled using {@link BinaryModule.emitLog}.
	 */
	log: (data: {
		/**  */
		line: string
		/**
		 * UTC timestamp of when the event is emitted
		 * Format: `YYYY-MM-DDThh:mm:ssZ`
		 */
		timestamp: string
	}) => void

	/**
	 * Emits notifications received from the binary's output stream
	 *
	 * Event is only emitted when {@link StartOptions.ipcOptions} contains a non-empty tag and individual
	 * binary output stream line matches the tag.
	 */
	notification: (data: {
		/**
		 * The JSON string excluding the tag in {@link StartOptions.ipcOptions} and anything before it.
		 *
		 * {@link NotificationOptions} JSON string
		 */
		notification: string
		/**
		 * UTC timestamp of when the event is emitted
		 * Format: `YYYY-MM-DDThh:mm:ssZ`
		 */
		timestamp: string
	}) => void
}
