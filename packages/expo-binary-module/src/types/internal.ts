import type { BinaryModule } from './binaryModule'

export type StoreAIOFuncInternal = (
	key: string,
	value?: string | null,
	remove?: boolean,
) => string | null

export type NotificationInernal = NotificationOptions & { id?: number }

export type BinaryModuleInternal = Omit<
	BinaryModule,
	| 'configStore'
	| 'encryptedStore'
	| 'encryptedStoreAsync'
	| 'notificationCancel'
	| 'notificationSet'
> & {
	notificationCancel: (id: number) => void
	notificationSet: (options: NotificationInernal) => number
	store: StoreAIOFuncInternal
	storeEncrypted: StoreAIOFuncInternal
	storeEncryptedAsync: (
		key: string,
		value?: string | null,
		remove?: boolean,
	) => Promise<string | null>
}
