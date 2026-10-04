export type AppStateStatus =
	'active' | 'background' | 'inactive' | 'unknown' | 'extension'

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
