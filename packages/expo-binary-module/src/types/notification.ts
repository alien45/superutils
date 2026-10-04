import type { BINARY_NOTIFICATION_ID } from './constants'

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
