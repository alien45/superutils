import { TypedMap } from '@superutils/core'
import { IStore, Store_OptionKeys } from './IStore'
import type { Store_Parse, Store_Stringify } from './types'
import {
	IObjectStore_ValidatorParams,
	Store_ValidatorFactory,
} from './validate'

// @ts-expect-error force override properties while preserving documentation of IStore
export interface IObjectStore<
	T extends object = object,
	CacheDisabled extends boolean = false,
> extends Omit<IStore<keyof T, T[keyof T], CacheDisabled>, 'validate'> {
	/**
	 * Default: `object`
	 */
	type: string

	get<TKey extends keyof T>(key: TKey): T[keyof T] | undefined

	getAll(forceRead?: boolean): TypedMap<T>

	parse?: Store_Parse<TypedMap<T>, IObjectStore<T, CacheDisabled>>

	/** Sugar for setAll() without replace */
	patch: (
		data: Partial<T>,
		silent?: boolean,
	) => IObjectStore<T, CacheDisabled>

	set<TKey extends keyof T, Value extends T[keyof T]>(
		key: TKey,
		value: Value | ((currentValue?: Value) => Value),
	): IObjectStore<T, CacheDisabled>

	setAll<
		Replace extends boolean = false,
		Data extends T | Partial<T> = Replace extends true
			? T // require full update
			: Partial<T>, // allow partial updates
	>(
		data: Data | TypedMap<Data>,
		replace?: Replace,
		silent?: boolean,
		validated?: boolean,
	): IObjectStore<T, CacheDisabled>

	stringify?: Store_Stringify<TypedMap<T>, IObjectStore<T, CacheDisabled>>

	/** Convert data/object to typed map */
	toMap<Data extends object = T>(data?: Data): TypedMap<Data>

	toObject<O extends object = T>(
		data?: TypedMap<T> | Map<keyof T, T[keyof T]>,
	): O

	/**
	 * A configuration object containing optional validation hooks for specific store operations.
	 *
	 * See {@link IStore.validate} for more details.
	 *
	 * **For a list of actions that can be validated, see {@link IObjectStore_ValidatorParams}.**
	 */
	validate?: Store_ValidatorFactory<
		IObjectStore<T, CacheDisabled>,
		IObjectStore_ValidatorParams<T>
	>
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
