import {
	DebounceOptions,
	DropFirst,
	filter,
	search,
	sort,
	SortOptions,
	ThrottleOptions,
	ValueOrPromise,
} from '@superutils/core'
import { BehaviorSubject, Subject } from '../rxjs'

/** Throttle & debounce related options */
export type DelayOptions =
	| ({
			throttle: true
	  } & Omit<ThrottleOptions, 'onError' | 'thisArg'>)
	| ({
			throttle?: false
	  } & Omit<DebounceOptions, 'onError' | 'thisArg'>)

/**
 * Categorizes errors encountered during DataStorage operations.
 *
 * These types are passed to the `onError` callback to help identify which phase of the
 * data lifecycle (reading, writing, or processing) failed.
 */
export enum OnErrorType {
	/** Occurs when the user-provided `onChange` callback throws an exception. */
	onChange = 'onChange',
	/** Occurs when the user-provided `parse` function fails to process the raw storage string. */
	parse = 'parse',
	/**
	 * Occurs when the default `JSON.parse` fallback fails.
	 * This usually happens if the data in the underlying storage is corrupted or not valid JSON.
	 */
	parse_json = 'parse-json',
	/** Occurs when the user-provided `stringify` function fails to serialize the data Map. */
	stringify = 'stringify',
	/**
	 * Occurs when the default `JSON.stringify` fallback fails.
	 * This may happen if the Map contains circular references or other non-serializable values.
	 */
	stringify_json = 'stringify-json',
	/** Occurs when the attempt to save data to the underlying storage (e.g., `localStorage.setItem`) fails. */
	write = 'write',
}
/** Storage type with only properties that are used by `DataStorage` */
export type StorageCompact = Pick<Storage, 'getItem' | 'setItem'>

export type StorageFilter<K, V, AsArray extends boolean = false> = (
	...args: DropFirst<Parameters<typeof filter<K, V, AsArray>>>
) => ReturnType<typeof filter<K, V>>

export type StorageFind<K, V, AsArray extends boolean = false> = (
	predicateOrOptions:
		| Parameters<StorageFilter<K, V, AsArray>>[0]
		| Parameters<StorageSearch<K, V>>[0],
) => V | undefined

export type StorageMap<K, V, T = unknown> = (
	callback: (value: V, key: K, data: [K, V][], index: number) => T,
) => T[]

export type StorageOnChangeFn<K, V, CD extends boolean = false> = (
	this: IDataStorage<K, V, CD>,
	data: Map<K, V>,
) => ValueOrPromise<void | Map<K, V>>

export type StorageOnErrorFn<K, V, CD extends boolean = false> = (
	this: IDataStorage<K, V, CD>,
	err: unknown,
	type: OnErrorType,
) => ValueOrPromise<void>

/** Initial options provided through the constructor */
export type StorageOptions<
	Key,
	Value,
	CacheDisabled extends boolean = false,
> = {
	/** value to set, only if storage is empty. Default: `new Map()` */
	initialValue?: Map<Key, Value>
} & Pick<
	Partial<IDataStorage<Key, Value, CacheDisabled>>,
	| 'cacheDisabled'
	| 'onChange'
	| 'onError'
	| 'parse'
	| 'spaces'
	| 'storage'
	| 'stringify'
>
	& (CacheDisabled extends false
		? Pick<
				Partial<IDataStorage<Key, Value, CacheDisabled>>,
				'delay' | 'delayOptions'
			>
		: { delay?: never; delayOptions?: never })

export type StorageParseFn<K, V, CD extends boolean = false> = (
	this: IDataStorage<K, V, CD>,
	data: string,
) => Map<K, V>

export type StorageSearch<
	K,
	V,
	MatchExact extends boolean = false,
	AsMap extends boolean = true,
> = (
	...args: DropFirst<Parameters<typeof search<K, V, MatchExact, AsMap>>>
) => ReturnType<typeof search<K, V, MatchExact, AsMap>>

export type StorageSort<K, V> = (
	...args:
		| StorageSortByComparator<K, V>
		| StorageSortByPropertyName<V>
		| StorageSortByKey
) => Map<K, V>

export type StorageSortByComparator<K, V> = [
	comparator: Parameters<typeof sort<K, V>>[1],
	options?: StorageSortOptions,
]

export type StorageSortByKey = [byKey: true, options?: StorageSortOptions]
export type StorageSortByPropertyName<V> = [
	propertyName: keyof V & string,
	options?: StorageSortOptions,
]

export type StorageSortOptions = SortOptions & { save?: boolean }

export type StorageStringifyFn<K, V, CD extends boolean = false> = (
	this: IDataStorage<K, V, CD>,
	data: Map<K, V>,
) => string

export type StorageToJSON<K, V> = (
	replacer?: null | ((key: K, value: V) => unknown),
	spacing?: string | number,
	data?: Map<K, V>,
) => string

export interface IDataStorage<
	Key,
	Value,
	CacheDisabled extends boolean = false,
> {
	/** Disable in-memory cache and only directly read/write from storage (local storage or JSON fle) */
	readonly cacheDisabled: CacheDisabled

	/**
	 * Debounce/throttle delay duration in milliseconds for writing to storage when caching is enabled.
	 *
	 * Increasing this value can improve performance when dealing with large datasets
	 * or frequent updates by reducing the number of write operations.
	 *
	 * Default: `300`
	 */
	readonly delay: number

	readonly delayOptions?: DelayOptions

	/**
	 * Indicates wherether storage has been initialized (`init()` function invoked).
	 */
	readonly initialized: boolean

	/**
	 * Storage name. Filename (NodeJS) or property name (browser LocalStorage).
	 * If empty string or undefined, data will not be saved to storage and will only work in-memory.
	 *
	 * Default: `''`
	 */
	readonly name?: string

	/** Get the number of items */
	readonly size: number

	/** Number of spaces to use when stringifying. Default: `undefined` */
	spaces?: number

	/**
	 * `LocalStorage` or equivalent storage instance to be used as the underlying storage and to read & write from.
	 *
	 * Notes:
	 * - Ignored when `name` is falsy (in-memory only mode)
	 * - For NodeJS or equivalent, an instance of `LocalStorage` from "node-localstoarge" NPM module can be used.
	 * - If `undefined`, will not attempt to use `globalThis.localStorage`, if available
	 * - If `null`, will not attempt to use `globalThis.localStorage`
	 *
	 * Default:
	 * - browser: `localStorage`
	 * - node: `undefined` (in-memory mode)
	 */
	readonly storage?: StorageCompact | null

	/**
	 * The underlying RxJS Subject that serves as the primary reactive interface for observing data modifications.
	 *
	 * Its implementation type is determined by the caching strategy:
	 * - **BehaviorSubject**: Used when caching is enabled.
	 * It maintains the current state and emits it immediately to new subscribers.
	 * - **Subject**: Used when caching is disabled.
	 * It acts as a pure event pipe, emitting updates only at the moment they occur without retaining an in-memory copy.
	 */
	readonly subject: CacheDisabled extends true
		? Subject<Map<Key, Value>>
		: BehaviorSubject<Map<Key, Value>>

	/** Clear all items */
	readonly clear: () => IDataStorage<Key, Value, CacheDisabled>

	/** Delete one or more items by their respective keys */
	readonly delete: (
		key: Key | Key[],
	) => IDataStorage<Key, Value, CacheDisabled>

	/** Find an item by predicate or search criteria */
	readonly find: StorageFind<Key, Value>

	/** Filter items by predicate */
	readonly filter: StorageFilter<Key, Value>

	/** Get item by key */
	readonly get: (key: Key) => Value | undefined

	/**
	 * Get all items
	 *
	 * @param forceUpdate (optional) if `true` and cache is enabled, reads & updates data directly from storage
	 */
	readonly getAll: (forceUpdate: boolean) => Map<Key, Value>

	/** Check if key exists */
	readonly has: (key: Key) => boolean

	/**
	 * Initializes storage and sets up internal subscriptions.
	 *
	 * Manual invocation is not typically necessary, as initialization occurs automatically
	 * in one of the following scenarios:
	 * - During construction, if an `initialValue` with at least one entry is provided.
	 * - On the first attempt to read or write data.
	 *
	 * @param initialValue An optional map to initialize the storage with if it's currently empty.
	 * @returns `true` if initialization was successful, or `false` if the storage was already initialized.
	 */
	readonly init: (initialValue?: Map<Key, Value>) => boolean

	/** Get all keys */
	readonly keys: () => Key[]

	/** Map each item on the data to an Array */
	readonly map: StorageMap<Key, Value>

	/**
	 * A callback function executed whenever a data change occurs within the storage.
	 *
	 * This hook allows for reactive side-effects. If the callback throws an error or returns a
	 * rejected Promise, the exception is caught gracefully and redirected to the {@link onError}
	 * callback with the type {@link OnErrorType.onChange}.
	 *
	 * Note: Execution of this callback is managed by internal subscriptions and will stop
	 * firing once {@link unsubscribe} is called.
	 */
	onChange?: StorageOnChangeFn<Key, Value, CacheDisabled>

	/**
	 * A global error handler invoked whenever an internal operation fails.
	 *
	 * It captures failures in the following areas:
	 * - Data parsing and serialization (JSON or custom logic).
	 * - Storage access (e.g., `localStorage` quota or permission errors).
	 * - Execution of user-provided callbacks like {@link onChange}.
	 *
	 * **Note:** If this handler itself throws an error, the exception is
	 * ignored gracefully to prevent application crashes during storage cycles.
	 */
	onError?: StorageOnErrorFn<Key, Value, CacheDisabled>

	/**
	 * A callback to customize the deserialization of data read from storage.
	 *
	 * This allows you to transform the raw string from the underlying storage back into a
	 * `Map<Key, Value>`. It serves as the functional inverse of {@link stringify}.
	 *
	 * **Fallback Behavior:**
	 * If this function is not defined, throws an error, or returns a non-Map value,
	 * the system falls back to internal `JSON.parse` logic.
	 *
	 * **Error Triggers:**
	 * - If this custom `parse` function fails: {@link onError} is triggered with {@link OnErrorType.parse}.
	 * - If the default `JSON.parse` fallback fails: {@link onError} is triggered with {@link OnErrorType.parse_json}.
	 */
	readonly parse?: StorageParseFn<Key, Value, CacheDisabled>

	/** Read directly from the localStorage (browser) or file (NodeJS) without triggering the `this.subject`. */
	readonly read: () => Map<Key, Value>

	/** Search items */
	readonly search: StorageSearch<Key, Value>

	/** Set item by key */
	readonly set: (
		key: Key,
		value: Value,
	) => IDataStorage<Key, Value, CacheDisabled>

	/**
	 * Set multiple entries at once and/or replace the storage entries
	 *
	 * @param data (optional) Data to add. Default: `new Map()`
	 * @param replace (optional) Whether to merge with or replace current data.
	 * - `true`: replace all entries with `data`
	 * - `false`: merge with current data (existing entries with matching keys will be overwritten)
	 *
	 * Default: `false`
	 */
	readonly setAll: (
		data?: Map<Key, Value>,
		replace?: boolean,
	) => IDataStorage<Key, Value, CacheDisabled>

	/**
	 * Sort items in the storage.
	 *
	 * @param nameOrComparator Criteria to sort by. Accepts one of the following:
	 * - `function`: A comparator function to sort the data.
	 * - `string`: A property name of the value object to sort by.
	 * - `true`: Sorts the map by its keys.
	 * @param options (optional) Sorting options.
	 * @param options.save (optional) Whether to save the sorted data back to storage (localStorage/file).
	 *
	 * @returns The sorted Map.
	 */
	readonly sort: StorageSort<Key, Value>

	/**
	 * A callback function to customize the serialization of data before it is written to storage.
	 *
	 * This allows you to transform the data `Map<Key, Value>` into a string format suitable
	 * for the underlying storage (e.g., JSON). It serves as the functional inverse of {@link parse}.
	 *
	 * Use this to sanitize data, remove circular references, or optimize the storage size by
	 * only persisting necessary fields.
	 *
	 * **Fallback Behavior:**
	 * If this function is not defined, throws an error, or returns a non-string value,
	 * the system falls back to internal `JSON.stringify` logic.
	 *
	 * **Error Triggers:**
	 * - If this custom `stringify` function fails: {@link onError} is triggered with {@link OnErrorType.stringify}.
	 * - If the default `JSON.stringify` fallback fails: {@link onError} is triggered with {@link OnErrorType.stringify_json}.
	 *
	 * @example
	 * #### Sanitize data before saving
	 * ```javascript
	 * import { DataStorage } from '@superutils/rx'
	 *
	 * const stringify = data => {
	 *   // Convert Map to an array of entries, removing sensitive fields
	 *   const entries = Array.from(data).map(([id, user]) => {
	 *     const { password, ...publicData } = user
	 *     return [id, publicData]
	 *   })
	 *   return JSON.stringify(entries)
	 * }
	 * const storage = new DataStorage('users', { stringify })
	 * ```
	 */
	readonly stringify?: StorageStringifyFn<Key, Value, CacheDisabled>

	/** Convert list of items (Map) to 2D Array */
	readonly toArray: () => [Key, Value][]

	/** Convert list of items (Map) to JSON string of 2D Array */
	readonly toJSON: StorageToJSON<Key, Value>

	/** Convert list of items into an object */
	readonly toObject: (data?: Map<Key, Value>) => Record<Key & string, Value>

	/** Convert list of items (Map) to JSON string of 2D Array */
	readonly toString: () => string

	/**
	 * Unsubscribe from all internal subscriptions.
	 *
	 * This will result in:
	 * - Automatic writing to storage being disabled (manual writes via `instance.write()` will still work).
	 * - The `onChange` callback no longer being triggered.
	 * - The instance stopping listening to force update cache triggers.
	 */
	readonly unsubscribe: () => void

	/** Get all values as an array */
	readonly values: () => Value[]

	/**
	 * Write data to the underlying storage (localStorage or file).
	 *
	 * @param data (optional) Data to write.
	 * - If provided, it overwrites the storage.
	 * - If not provided, the current in-memory data is used (if cache is enabled).
	 * @param silent (optional) Whether to suppress errors if the write operation fails.
	 * - `true`: Returns `false` on failure without throwing.
	 * - `false`: Throws an error on failure.
	 *
	 * Default: `this.silent`
	 * @returns `true` if the write was successful, `false` otherwise.
	 */
	readonly write: (data?: Map<Key, Value>, silent?: boolean) => void
}
