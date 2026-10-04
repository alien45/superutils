import { requireNativeModule } from 'expo'
import type {
	BinaryEnv,
	BinaryModule,
	EnvEntry,
	NotificationManager,
} from './types'
import { BINARY_NOTIFICATION_ID, ID_PREFIX, Status } from './types'
import type {
	BinaryModuleInternal,
	NotificationInernal,
} from './types/internal'

// ID to be auto incremented for non-binary notifications. Excludes BINARY_NOTIFICATION_ID.
let lastId = BINARY_NOTIFICATION_ID
export const binaryModule = requireNativeModule<BinaryModule>('BinaryModule')

const {
	store: configStore,
	storeEncrypted: encryptedStore,
	storeEncryptedAsync: encryptedStoreAsync,
	notificationCancel,
	notificationSet,
	start,
	startOptions,
} = binaryModule as unknown as BinaryModuleInternal
let startPromise = null as null | Promise<Status>

binaryModule.store = {
	delete: key => configStore(key, null, true),
	get: key => configStore(key),
	set: (key, value) => configStore(key, value),
}

binaryModule.storeEncrypted = {
	delete: key => encryptedStore(key),
	deleteAsync: key => encryptedStoreAsync(key) as Promise<null>,
	get: key => encryptedStore(key),
	getAsync: key => encryptedStoreAsync(key),
	set: (key, value) => encryptedStore(key, value),
	setAsync: (key, value) => encryptedStoreAsync(key, value),
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

binaryModule.start = async options => {
	if (startPromise) return await startPromise

	startPromise = (async () => {
		if (!options?.binaryName?.trim?.())
			throw new Error('No binary name provided')

		let status = await start({
			...options,
			env: processEnv(options.env),
			notification: {
				...options.notification,
				id: BINARY_NOTIFICATION_ID,
			} as NotificationInernal,
		})
		const { startupTimeout = 30 } = options
		const delay = 100
		let attempt = (startupTimeout * 1000) / delay

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

binaryModule.startOptions = options => {
	if (options) options.env = processEnv(options.env)
	return startOptions(options)
}

// config strings to { value: string }
function processEnv(env?: BinaryEnv) {
	env ??= {}
	for (const [key, value] of Object.entries(env)) {
		if (typeof value === 'string') env[key] = { value }
	}
	return env as Record<string, EnvEntry>
}
