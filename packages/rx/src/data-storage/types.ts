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

export type DelayOptions =
	| ({
			throttle: true
	  } & Omit<ThrottleOptions, 'onError' | 'thisArg'>)
	| ({
			throttle?: false
	  } & Omit<DebounceOptions, 'onError' | 'thisArg'>)

export type OnErrorType =
	| 'onChange' // triggered when instance.onChange() call fails
	| 'parse' // triggered when instance.parse() call fails
	| 'parse-json' // triggered when JSON.parse() call fails
	| 'stringify' // triggered when instance.stringify() call fails
	| 'stringify-json' // triggered when JSON.stringify() call fails
	| 'write' // triggered when instance.write() call fails

/** Storage type with only properties that are used by `DataStorage` */
export type StorageCompact = Pick<Storage, 'getItem' | 'setItem'>

export type StorageFilter<K, V extends StorageValue> = <
	IncludeKey extends boolean = false,
>(
	...args: DropFirst<Parameters<typeof filter<K, V, IncludeKey>>>
) => ReturnType<typeof filter<K, V, IncludeKey>>

export type StorageFind<K, V extends StorageValue> = (
	predicateOrOptions:
		| Parameters<StorageFilter<K, V>>[0]
		| Parameters<StorageSearch<K, V>>[0],
) => V | undefined

export type StorageMap<K, V extends StorageValue> = <T>(
	callback: (value: V, key: K, data: [K, V][], index: number) => T,
) => T[]

/**
 * Callback triggered when value changes and/or a force read is triggered
 */
export type StorageOnChangeFn<K, V extends StorageValue> = (
	data: Map<K, V>,
) => ValueOrPromise<void | Map<K, V>>

export type StorageOnErrorFn = (
	err: unknown,
	type: OnErrorType,
) => ValueOrPromise<void>

/** Initial options provided through the constructor */
export type StorageOptions<
	Key extends StorageKey,
	Value extends StorageValue,
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

export type StorageParseFn<K, V extends StorageValue> = (
	data: string,
) => Map<K, V>

export type StorageSearch<K, V extends StorageValue> = <
	MatchExact extends boolean = false,
	AsMap extends boolean = true,
>(
	...args: DropFirst<Parameters<typeof search<K, V, MatchExact, AsMap>>>
) => ReturnType<typeof search<K, V, MatchExact, AsMap>>

export type StorageSort<K, V extends StorageValue> = (
	...args:
		| StorageSortByComparator<K, V>
		| StorageSortByPropertyName<V>
		| StorageSortByKey
) => Map<K, V>

export type StorageSortByComparator<K, V extends StorageValue> = [
	comparator: Parameters<typeof sort<K, V>>[1],
	options?: StorageSortOptions,
]

export type StorageSortByKey = [byKey: true, options?: StorageSortOptions]
export type StorageSortByPropertyName<V extends StorageValue> = [
	propertyName: keyof V & string,
	options?: StorageSortOptions,
]

export type StorageSortOptions = SortOptions & { save?: boolean }

export type StorageStringifyFn<K, V extends StorageValue> = (
	data: Map<K, V>,
) => string

export type StorageToJSON<K, V> = (
	replacer?: null | ((key: K, value: V) => unknown),
	spacing?: string | number,
	data?: Map<K, V>,
) => string

export type StorageKey = string
export type StorageValue = Record<StorageKey, unknown>

export interface IDataStorage<
	Key extends StorageKey,
	Value extends StorageValue,
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
	 * Callback to be invoked  whenever value change is triggered.
	 *
	 * If `onChange` invocation fails, it will be ignored gracefully.
	 */
	onChange?: StorageOnChangeFn<Key, Value>

	/**
	 * Callback to be invoked whenever read/write operation fails.
	 *
	 * If `onError` invocation failure will be ignored gracefully.
	 */
	onError?: StorageOnErrorFn

	/**
	 * A callback to customize the deserialization of data read from storage.
	 *
	 * This can be used to override the default `JSON.parse` behavior and serves as the counterpart to `stringify`.
	 * If this function is not provided, throws an error, or returns `undefined`, the default
	 * `JSON.parse` will be used as a fallback.
	 */
	readonly parse?: StorageParseFn<Key, Value>

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
	 * Callback function to customize the serialization of data to be stored to storage.
	 *
	 * Useful when data needs to be sanitised before storing and/or remove circlar references.
	 *
	 * @example
	 * ```javascript
	 * import fetch from '@superutils/fetch'
	 * import { DataStorage } from '@superutils/rx'
	 * import { LocalStorage } from 'node-localstorage'
	 *
	 * // Create a localStorage alternative for NodeJS that reads and writes to JSON files.
	 * // This is not necessary for browsers
	 * globalThis.localStorage = new LocalStorage('./data', 1e7)
	 *
	 * const storage = new DataStorage('products.json')
	 * storage.stringify = data => Array
	 * 	.from(data)
	 *  .map(([key, product]) => [
	 *    key,
	 *    { id: product.id, title: product.title } // only store what's needed
	 *  ])
	 *
	 * const { products } = await fetch('[DUMMYJSON-DOT-COM]/products)
	 * const productsMap = result.products.map(p => [p.id, p])
	 * storage.setAll(productsMap, true)
	 * console.log(storage.getAll())
	 * ```
	 */
	readonly stringify?: StorageStringifyFn<Key, Value>

	/** Convert list of items (Map) to 2D Array */
	readonly toArray: () => [Key, Value][]

	/** Convert list of items (Map) to JSON string of 2D Array */
	readonly toJSON: StorageToJSON<Key, Value>

	/** Convert list of items into an object */
	readonly toObject: () => Record<Key, Value>

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
