import {
	DebounceOptions,
	DropFirst,
	filter,
	find,
	FindOptions,
	search,
	sort,
	SortOptions,
	ThrottleOptions,
	TypedMap,
	ValueOrPromise,
} from '@superutils/core'
import { BehaviorSubject, Subject } from '../rxjs'

// re-export useful stuff from core package
export { type TypedMap } from '@superutils/core'

/** Storage type with only properties that are used by `DataStorage` */
export type StorageCompact = Pick<Storage, 'getItem' | 'setItem'>

/** Throttle & debounce related options */
export type Store_DelayOptions =
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
export enum Store_OnErrorType {
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

/** Initial options provided through the constructor */
export type Store_Options<Key, Value, CacheDisabled extends boolean = false> = {
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
	 * @default undefined
	 */
	initialValue?: Map<Key, Value>
} & Pick<
	Partial<IStore<Key, Value, CacheDisabled>>,
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
				Partial<IStore<Key, Value, CacheDisabled>>,
				'delay' | 'delayOptions'
			>
		: { delay?: never; delayOptions?: never })

export type Store_Parse<ResultMap, ThisArg> = (
	this: ThisArg,
	text: string | null | undefined,
) => ResultMap | void

export type Store_Search<
	K,
	V,
	MatchExact extends boolean = false,
	AsMap extends boolean = true,
> = (
	...args: DropFirst<Parameters<typeof search<K, V, MatchExact, AsMap>>>
) => ReturnType<typeof search<K, V, MatchExact, AsMap>>

export type Store_Sort<K, V> = (
	...args:
		| Store_SortByComparator<K, V>
		| Store_SortByPropertyName<V>
		| Store_SortByKey
) => Map<K, V>
export type Store_SortByComparator<K, V> = [
	comparator: Parameters<typeof sort<K, V>>[1],
	options?: Store_SortOptions,
]
export type Store_SortByKey = [byKey: true, options?: Store_SortOptions]
export type Store_SortByPropertyName<V> = [
	propertyName: keyof V & string,
	options?: Store_SortOptions,
]

export type Store_SortOptions = SortOptions & { save?: boolean }

export type Store_Stringify<Data, ThisArg> = (
	this: ThisArg,
	data: Data,
) => string | undefined | void

export type Store_ToJSON<K, V> = (
	replacer?: null | ((key: K, value: V) => unknown),
	spacing?: string | number,
	data?: Map<K, V>,
) => string

// export type

export interface IStore<Key, Value, CacheDisabled extends boolean = false> {
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

	readonly delayOptions?: Store_DelayOptions

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
	readonly name?: string | null

	/**
	 * Indicates type of data parsed as
	 *
	 * Default: 'map'
	 */
	type: string

	/**
	 * A callback function executed whenever a data change occurs within the storage.
	 *
	 * This hook allows for reactive side-effects. If the callback throws an error or returns a
	 * rejected Promise, the exception is caught gracefully and redirected to the {@link onError}
	 * callback with the type {@link Store_OnErrorType.onChange}.
	 *
	 * Note: Execution of this callback is managed by internal subscriptions and will stop
	 * firing once {@link unsubscribe} is called.
	 */
	onChange?: (
		this: IStore<Key, Value, CacheDisabled>,
		data: Map<Key, Value>,
	) => ValueOrPromise<void | Map<Key, Value>>

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
	onError?: (
		this: IStore<Key, Value, CacheDisabled>,
		err: unknown,
		type: Store_OnErrorType,
	) => ValueOrPromise<void>

	/**
	 * A callback to customize the deserialization of data read from storage.
	 *
	 * This allows you to transform the raw string from the underlying storage back into a
	 * `Map<Key, Value>`. It serves as the functional inverse of {@link stringify}.
	 *
	 * **Fallback Behavior:** The system falls back to internal `JSON.parse` logic if `parse`:
	 * - is not a non-function
	 * - throws an error
	 * - returns a non-Map value,
	 *
	 * **Error Triggers:**
	 * - If this custom `parse` function fails: {@link onError} is triggered with {@link Store_OnErrorType.parse}.
	 * - If the default `JSON.parse` fallback fails: {@link onError} is triggered with {@link Store_OnErrorType.parse_json}.
	 */
	parse?: Store_Parse<Map<Key, Value>, IStore<Key, Value, CacheDisabled>>

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
	readonly storage?: StorageCompact | Storage | null

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
	 * If this function is not defined, throws an error, or returns `undefined` or a non-string value,
	 * the system falls back to internal `JSON.stringify` logic.
	 *
	 * **Error Triggers:**
	 * - If this custom `stringify` function fails: {@link onError} is triggered with {@link Store_OnErrorType.stringify}.
	 * - If the default `JSON.stringify` fallback fails: {@link onError} is triggered with
	 * {@link Store_OnErrorType.stringify_json}.
	 *
	 * @param data a map of all values stored in this storage
	 *
	 * @returns string or undefined
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
	stringify?: Store_Stringify<
		Map<Key, Value>,
		IStore<Key, Value, CacheDisabled>
	>

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
	readonly clear: () => IStore<Key, Value, CacheDisabled>

	/** Delete one or more items by their respective keys */
	readonly delete: (key: Key | Key[]) => IStore<Key, Value, CacheDisabled>

	/** Filter items by predicate */
	readonly filter: <AsArray extends boolean = false>(
		...args: DropFirst<Parameters<typeof filter<Key, Value, AsArray>>>
	) => ReturnType<typeof filter<Key, Value, AsArray>>

	/** Find an item by predicate or search criteria */
	readonly find: <IncludeKey extends boolean = false>(
		predicateOrOptions:
			| FindOptions<Key, Value, IncludeKey>
			| Parameters<IStore<Key, Value, CacheDisabled>['filter']>[0],
	) => ReturnType<typeof find<Key, Value, IncludeKey>>

	/** Get item by key */
	readonly get: (key: Key) => Value | undefined

	/**
	 * Get all items
	 *
	 * @param forceUpdate (optional) if `true` and cache is enabled, reads & updates data directly from storage
	 * Default: `false`
	 */
	readonly getAll: (forceUpdate?: boolean) => Map<Key, Value>

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
	readonly map: <T = unknown>(
		callback: (
			value: Value,
			key: Key,
			entries: [Key, Value][],
			index: number,
		) => T,
	) => T[]

	/**
	 * Reads and parses data directly from the persistent storage medium.
	 *
	 * This operation is synchronous and does not trigger reactive updates via `subject`.
	 * It is useful for debugging custom `parse` logic or manual data retrieval.
	 *
	 * If `instance.parse` function is provided and invokation fails, an empty Map will be returned.
	 *
	 * @param dataStr (optional) A raw string to parse. If omitted, the method fetches
	 * the current value associated with the instance `name` from the underlying `storage`.
	 */
	readonly read: (dataStr?: string | null) => Map<Key, Value>

	/**
	 * Search through the stored data (`Map<Key, Value>`).
	 * It supports both a global search (using a string or RegExp) across all properties
	 * of an item, and a detailed, field-specific search using a query object.
	 *
	 * @param options The search criteria. See {@link SearchOptions} for available properties.
	 *
	 * @returns A `Map` or an `Array` containing the matched items, based on the `asMap` option.
	 *
	 * @example
	 * #### Search for users in a specific city
	 * ```javascript
	 * import { DataStorage } from '@superutils/rx'
	 *
	 * const storage = new DataStorage('users', {
	 *   initialValue: new Map([
	 *     [1, { name: 'John Doe', city: 'New York' }],
	 *     [2, { name: 'Jane Doe', city: 'London' }],
	 *     [3, { name: 'Peter Jones', city: 'New York' }],
	 *   ])
	 * })
	 *
	 * const nyUsers = storage.search({ query: { city: 'New York' } })
	 * console.log(nyUsers.size) // 2
	 * ```
	 */
	readonly search: <
		MatchExact extends boolean = false,
		AsMap extends boolean = true,
	>(
		...args: DropFirst<
			Parameters<typeof search<Key, Value, MatchExact, AsMap>>
		>
	) => ReturnType<typeof search<Key, Value, MatchExact, AsMap>>

	/** Set item by key */
	readonly set: (
		key: Key,
		value: Value | ((currentValue?: Value) => Value),
	) => IStore<Key, Value, CacheDisabled>

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
	) => IStore<Key, Value, CacheDisabled>

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
	readonly sort: Store_Sort<Key, Value>

	/** Convert list of items (Map) to 2D Array */
	readonly toArray: () => [Key, Value][]

	/** Convert list of items (Map) to JSON string of 2D Array */
	readonly toJSON: Store_ToJSON<Key, Value>

	/** Convert list of items into an object */
	readonly toObject: <T extends object = object>(data?: Map<Key, Value>) => T

	/** Convert list of items (Map) to JSON string of 2D Array */
	readonly toString: (data?: Map<Key, Value>) => string

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
	 * @returns `true` if the write was successful, `false` otherwise.
	 */
	readonly write: (data?: Map<Key, Value>) => void
}

// @ts-expect-error force override properties while preserving documentation of IDataStorage
export interface IObjectStore<
	T extends object,
	CacheDisabled extends boolean = false,
	ObjectMap extends TypedMap<T> = TypedMap<T>,
> extends IStore<keyof T, T[keyof T], CacheDisabled> {
	/**
	 * Default: `object`
	 */
	type: string

	get<Key extends keyof T>(key: Key): T[Key] | undefined

	getAll(forceRead?: boolean): TypedMap<T>

	parse?: Store_Parse<ObjectMap, IObjectStore<T, CacheDisabled>>

	set<Key extends keyof T, Value extends T[Key]>(
		key: Key,
		value: Value | ((currentValue?: Value) => Value),
	): IObjectStore<T, CacheDisabled>

	setAll(data?: ObjectMap, replace?: boolean): IObjectStore<T, CacheDisabled>

	stringify?: Store_Stringify<ObjectMap, IObjectStore<T, CacheDisabled>>

	toObject<O extends object = T>(data?: Map<keyof T, T[keyof T]>): O
}
