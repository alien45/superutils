import type { BinaryEnv } from './env'
import type { IpcOptions } from './ipc'

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
	 * Default: `['cellular']`
	 */
	networkTypes?: DeviceNetworkType[]

	/** Auto stop binary if device is on power save mode */
	powerSaveMode?: boolean
}

export enum DeviceNetworkType {
	CELLULAR = 'cellular',
	ETHERNET = 'ethernet',
	NONE = 'none', // default
	OTHER = 'other',
	VPN = 'vpn',
	WIFI = 'wifi',
}

export type StartOptions = {
	/**
	 * Whether to auto-start binary on app start and device reboot.
	 *
	 * Default: `false`
	 */
	autoStart?: boolean

	/**
	 * Number of seconds to delay before auto starting
	 * Default: `0`
	 */
	autoStartDelay?: number

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
