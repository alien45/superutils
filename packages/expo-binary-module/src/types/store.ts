export type Store = {
	delete: (key: string) => void
	get: (key: string) => string | null
	set: (key: string, value: string) => string | null
}

export type EncryptedStore = {
	delete: (key: string) => void
	deleteAsync: (key: string) => void
	get: (key: string) => string | null
	getAsync: (key: string) => string | null
	set: (key: string, value: string) => string | null
	setAsync: (key: string, value: string) => string | null
}
