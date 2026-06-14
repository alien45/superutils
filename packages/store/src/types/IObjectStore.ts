import { TypedMap } from '@superutils/core'
import { IStore, Store_OptionKeys } from './IStore'
import type { Store_Parse, Store_Stringify } from './types'

// @ts-expect-error force override properties while preserving documentation of IStore
export interface IObjectStore<
	T extends object = object,
	CacheDisabled extends boolean = false,
> extends IStore<keyof T, T[keyof T], CacheDisabled> {
	/**
	 * Default: `object`
	 */
	type: string

	get<Key extends keyof T>(key: Key): T[Key] | undefined

	getAll(forceRead?: boolean): TypedMap<T>

	parse?: Store_Parse<TypedMap<T>, IObjectStore<T, CacheDisabled>>

	set<Key extends keyof T, Value extends T[Key]>(
		key: Key,
		value: Value | ((currentValue?: Value) => Value),
	): IObjectStore<T, CacheDisabled>

	setAll(
		data?: T | TypedMap<T>,
		replace?: boolean,
	): IObjectStore<T, CacheDisabled>

	stringify?: Store_Stringify<TypedMap<T>, IObjectStore<T, CacheDisabled>>

	/** Convert data/object to typed map */
	toMap(data?: T): TypedMap<T>

	toObject<O extends object = T>(
		data?: Map<keyof T, T[keyof T]> | TypedMap<T>,
	): O
}

/**
 * Configuration options for initializing {@link IStore} instances.
 *
 * These options define the behavior of caching, persistence, error handling, and validation.
 */
export type ObjectStore_Options<
	T extends object = Record<PropertyKey, unknown>,
	CacheDisabled extends boolean = false,
> = {
	/**
	 * An optional `Map` used to seed the storage if no persistent data is found for the instance.
	 *
	 * **Data Precedence:**
	 * Persistent data associated with the instance's specific `name` takes priority. This value is
	 * only utilized if the storage entry for that `name` does not exist (e.g., first-time use).
	 *
	 * **Initialization Behavior:**
	 * - If provided and non-empty, the instance initializes immediately during construction.
	 * - Otherwise, initialization is lazy, occurring upon an explicit `init()` call or the first read/write operation.
	 *
	 * **Type Inference:**
	 * When provided, it enables automatic inference of the `Key` and `Value` generic types.
	 * If omitted, these default to `unknown` and `object` respectively, unless explicitly defined.
	 *
	 * Default: `undefined`
	 */
	initialValue?: T
} & Partial<
	Pick<IObjectStore<T, CacheDisabled>, Store_OptionKeys>
		& (CacheDisabled extends false
			? Pick<IObjectStore<T, CacheDisabled>, 'delay' | 'delayOptions'>
			: { delay?: never; delayOptions?: never })
>
