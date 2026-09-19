import { NativeModule, requireNativeModule } from 'expo'
import { AppState } from 'react-native'

/**
 * Fixed notification ID used for the persistent foreground service notification
 */
export const ID_PREFIX = '7337'
export const BINARY_NOTIFICATION_ID = 73370000
export const JNI_LIBS_DIR = '[[JNI_LIBS_DIR]]'
let lastId = BINARY_NOTIFICATION_ID

declare class BinaryModule extends NativeModule<BinaryModuleEvents> {
	/**
	 * Get/Set/update `emitLog` flag.
	 *
	 * If enabled, each line of stdout log from the binary will be emitted as they appear with event named "log".
	 *
	 * **CAUTION:** make sure to disable it when logs are no longer needed. For notifications use
	 * {@link StartOptions.ipcOptions}
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

	/** Get binar/foreground service status */
	getStatus: () => Status

	/**
	 * Get app files storage directory path
	 *
	 * Eg: `"/storage/emulated/0/Android/data/app.package.name/files"`
	 */
	getStoragePath: () => string

	notification: NotificationManager

	/** Check if app has device permission (eg: storage access code) */
	permissionCheck: (code: number) => boolean

	/** Request device permission by code */
	permissionRequest: (code: number) => boolean

	/**
	 * Update current app status
	 *
	 * PS: Binary module will auto update the app state. Only use this if you would like to manually trigger a change
	 * if IPC notifictation should be triggered.
	 */
	setAppState: (status: AppStateStatus) => void

	/** Set/update start options */
	setStartOptions: (options: StartOptions) => void

	/** Check if app has read/write permission to external storage */
	storagePermissionCheck: () => boolean

	/**
	 * Request access to read and write to external storage.
	 * Your Android manifest file (`expo.android.permissions` in Expo `app.json`)
	 * must include the following permissions:
	 *
	 * - **Android 11+**: `MANAGE_EXTERNAL_STORAGE`
	 * - **Android ≤10**: `WRITE_EXTERNAL_STORAGE` & `READ_EXTERNAL_STORAGE`
	 * ```
	 */
	storagePermissionRequest: () => Promise<boolean>

	/**
	 * Start binary (if not already started)
	 *
	 * @param options see {@link StartOptions}
	 *
	 * @retuns binary status
	 */
	start: (options: StartOptions) => Promise<Status>

	/** Stop the binary, foreground service and close persistent notification*/
	stop: () => Promise<void>
}

export type AppStateStatus =
	| 'active'
	| 'background'
	| 'inactive'
	| 'unknown'
	| 'extension'

export type AutoStopOptions = {
	/** Auto stop binary if device is on airplane mode */
	airplaneMode?: boolean

	/**
	 * Auto stop binary if battery level is below provided level/percentage.
	 *
	 * Default: `10`   (=**10%**)
	 */
	batteryLevelBelow?: number

	/** Auto stop binary if battery is not in charging state */
	batteryNotCharging?: boolean

	/** Auto stop binary if network is metered. Default: `false` */
	metered?: boolean

	/**
	 * Auto stop if matches any of the network types provided
	 *
	 * Default: `[DeviceNetworkType.CELLULAR]`
	 */
	networkTypes?: DeviceNetworkType[]

	/** Auto stop binary if device is on power save mode */
	powerSaveMode?: boolean
}

export type BinaryEnv = Record<string, EnvEntry | string>

export type BinaryModuleEvents = {
	log: (data: {
		line: string
		/**
		 * UTC timestamp of when the event is emitted
		 * Format: `YYYY-MM-DDThh:mm:ssZ`
		 */
		timestamp: string
	}) => void
	notification: (data: {
		/**
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

export enum DeviceNetworkType {
	CELLULAR = 'cellular',
	ETHERNET = 'ethernet',
	NONE = 'none', // default
	OTHER = 'other',
	VPN = 'vpn',
	WIFI = 'wifi',
}

/** Single environment variable configuration */
export type EnvEntry = {
	/**
	 * If true, the value will only be passed to the binary.
	 * Value will NOT be exposed to RN and will be excluded from `getValues()` result.
	 *
	 * Default: `false`
	 */
	binaryOnly?: boolean
} & (
	| {
			/** Whether to base64 encode the generated string */
			encode?: boolean
			/** Prefix to be attached to random value */
			prefix?: string
			/** Generate a random string value  */
			random: true
			/** Number of characters to generate (before encoding). Default: `32` */
			length?: number
	  }
	| {
			/**
			 * Fixed value.
			 *
			 * To provide the JNI Libs directory as part of an environment variable use the keyword: {@link JNI_LIBS_DIR}.
			 *
			 * Eg: `[[JNI_LIBS_DIR]]/mylib.so` will be transformed to `/data/app/~~.......==/com.your.app-......==/lib/<ARCH>/mylib.so`
			 */
			value: string
			random?: never
	  }
)

export type IpcOptions = {
	/**
	 * Choose which {@link AppState} the binary service is allowed to create an IPC notification
	 *
	 *
	 * Default: `undefined` (notifies on all states excluding "active")
	 */
	notifyOnAppStates?: AppStateStatus[]

	/**
	 * Tag used to identity and create notifications from binary stdout logs.
	 *
	 * This allows the binary to update the persistent notification as well as create new notifcations.
	 *
	 * To update persistent notification, "id" must be set to {@link BINARY_NOTIFICATION_ID} in the log.
	 *
	 * #### Notes:
	 * - If the tag is set to `[notification]`, everything after it will be parsed as {@link NotificationOptions}.
	 * - If parse fails, it will be ignored.
	 * - Multiline parsing is not supported. The {@link NotificationOptions} must be a single-line valid JSON string.
	 *
	 * #### Example binary log:
	 * ```text
	 * 2000-01-01 01:01:01.999 [notification] { "id": 1, "title": "New message!", "text": "Click to open app" }
	 * ```
	 */
	tag: string
}

export type NotificationAction = {
	/**
	 * Determines what to do when the action button is clicked
	 *
	 * Accepted values:
	 * - `stop`: stop binary and the foreground service along with the persistent notification
	 * - `open`: open the app or the specified `uri`
	 */
	id: 'stop' | 'open'

	/** Text to be displayed on the action button */
	title: string

	/** URI to open when `id` is "open" */
	uri?: string
}

/**
 * Notification ID
 *
 * It cannot be equal to {@link  BINARY_NOTIFICATION_ID}
 */
export type NotificationID<T extends undefined | number> =
	T extends typeof BINARY_NOTIFICATION_ID ? never : T & number

export type NotificationManager = {
	/**
	 * Set/update persistent foreground service notification
	 *
	 * Options will be merged with {@link StartOptions.notification} if {@link binaryModule.start()} function
	 * has already been invoked.
	 *
	 * @returns Notification id: {@link BINARY_NOTIFICATION_ID}
	 */
	binary: (options: NotificationOptions) => typeof BINARY_NOTIFICATION_ID
	/**
	 * Close existing notification.
	 *
	 * Notes:
	 * - Ignores if notification does not exist
	 * - If {@link BINARY_NOTIFICATION_ID} is closed, it may cause the foreground service to be closed unexpected.
	 *
	 * @param id notification ID
	 */
	close: (id: number) => void
	/**
	 * Create or update notification (unrelated to the persistent foreground service notification)
	 *
	 * This will not affect the persistent binary status notification.
	 */
	set: <ID extends number | undefined>(
		options: NotificationOptions,
		id?: NotificationID<ID>,
	) => ID
}

export type NotificationOptions = {
	actions?: NotificationAction[]

	/** What to do when notification body is pressed */
	clickAction?: NotificationAction

	/**
	 * Notification ID
	 */
	id?: number

	/** Whether to persist the notification */
	ongoing?: boolean

	/** Show a progress bar */
	progress?: {
		current: number
		max: number
		indeterminate?: boolean
	}

	/** Notification body */
	text?: string

	/**
	 * Notification title.
	 * Deafult: `${appName}: Foreground Service`
	 */
	title?: string
}

export type StartOptions = {
	/**
	 * Whether to auto-start binary on app start and device reboot.
	 *
	 * Default: `false`
	 */
	autoStart?: boolean

	/**
	 * Auto stop options. While technically the binary is stopped and restarted, this effectively auto-pauses and
	 * resumes based on device network and battery statuses.
	 *
	 * If provided and binary was previously started but not manually stopped, it will monitor device network &
	 * battery status and automatically stop the binary when conditions are met. And then restart binary when
	 * conditions no longer meet.
	 *
	 * To disable use `undefined`/`null`
	 *
	 * Default: `{ batteryLevelBelow: 10, networkTypes: ['cellular' ]}`
	 */
	autoStop?: AutoStopOptions | null

	/**
	 *
	 * Duration in milliseconds to wait after invoking `start()` if status does't change to started.
	 *
	 * It will keep checking statups every 100ms up to the maximum duration provided.
	 *
	 * Default: `3000`
	 */
	awaitStartDelay?: number

	/**
	 * Name of the binary file to be executed.
	 *
	 * The binary file must be available in the `jniLibs` directory.
	 *
	 * For more details, check out the `jniLibs Configuration` section in the README.md.
	 */
	binaryName: string

	/**
	 * Record containing environment varibles to be passed to the binary.
	 *
	 * Key: string. environment variable name.
	 * Value: {@link EnvEntry} variable configuration.
	 */
	env?: BinaryEnv

	/**
	 * Options for **InterProcess Communication** (IPC) from the executed binary to the React Native app.
	 *
	 * #### How this works?
	 * If enabled (by setting a `tag`), the binary service will monitor each line printed by executed binary
	 * and create a notification if matched. See {@link IpcOptions.tag}
	 */
	ipcOptions?: IpcOptions

	/** Default notification options used with foreground service notification */
	notification?: Partial<NotificationOptions>

	/** Optionally, provide a case-insensitive text to match binary log outputs to confirm successful start */
	startupText?: string

	/**
	 * Startup timeout duration in seconds.
	 * If `startupText` does not appear in the log within this duration, it will be assumed that startup has failed.
	 *
	 * Default: `30`
	 */
	startupTimeout?: number
}

export enum Status {
	CRASHED = 'crashed',
	NEVER_STARTED = 'never_started',
	STARTED = 'started',
	STARTING = 'starting',
	STOPPING = 'stopping',
	STOPPED = 'stopped',
}

const binaryModule = requireNativeModule<BinaryModule>('BinaryModule')
const { notificationCancel, notificationSet, start } =
	binaryModule as BinaryModule & {
		notificationCancel: (id: number) => void
		notificationSet: (options: NotificationOptions, id?: number) => number
	}
let startPromise = null as null | Promise<Status>

binaryModule.start = async options => {
	options.notification ??= {}
	options.notification.id ??= BINARY_NOTIFICATION_ID
	if (startPromise) return await startPromise

	startPromise = (async () => {
		if (!options?.binaryName?.trim?.())
			throw new Error('No binary name provided')

		options.env ??= {}
		for (const [key, value] of Object.entries(options.env)) {
			if (typeof value === 'string') options.env[key] = { value }
		}

		let status = await start(options)
		const { awaitStartDelay = 3000 } = options
		const delay = 100
		let attempt = awaitStartDelay / delay

		while (
			[Status.STARTING, Status.NEVER_STARTED].includes(status)
			&& attempt > 0
		) {
			attempt--
			await new Promise(r => setTimeout(r, delay))
			status = binaryModule.getStatus()

			if (status === Status.STARTED) break
		}

		return status
	})()
	startPromise
		.catch(() => {
			/* */
		})
		.finally(() => {
			startPromise = null
		})

	return await startPromise
}
binaryModule.notification = {
	binary: options =>
		notificationSet({ ...options, id: BINARY_NOTIFICATION_ID }),
	close: notificationCancel,
	set: options => {
		const { id } = options
		if ([undefined, BINARY_NOTIFICATION_ID].includes(id)) {
			options.id = ++lastId
		} else if (`${id}`.startsWith(ID_PREFIX) && id! > lastId) {
			lastId = id!
		}
		options.ongoing ??= false
		return notificationSet(options)
	},
} as NotificationManager

// set the initial state
binaryModule.setAppState(AppState.currentState)
AppState.addEventListener('change', state => {
	// update state on change
	binaryModule.setAppState(state)
})
export default binaryModule
