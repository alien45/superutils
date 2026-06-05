import {
	DropFirst,
	filter,
	find,
	FindOptions,
	search,
	ValueOrPromise,
} from '@superutils/core'
import { BehaviorSubject, Subject } from 'rxjs'
import {
	StorageCompact,
	Store_DelayOptions,
	Store_OnErrorType,
	Store_Parse,
	Store_Sort,
	Store_Stringify,
	Store_ToJSON,
} from './types'

/**
 * Represents a generic, reactive, and persistent Map-like data store.
 *
 * The `IStore` interface defines the contract for a data structure that combines the standard
 * functionality of a JavaScript `Map` with advanced features such as RxJS-powered reactivity,
 * optional persistence (e.g., to LocalStorage or a JSON file), and built-in search, sorting, and filtering.
 *
 * It is designed to be framework-agnostic but provides features that integrate well with
 * reactive systems and modern UI libraries like React.
 *
 * @template Key - The type of keys used to identify values in the store.
 * @template Value - The type of values stored in the store.
 * @template CacheDisabled - A boolean flag; if `true`, the store operates without an in-memory cache,
 * reading and writing directly to the underlying storage on every operation.
 */
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
	 * Default: `null`
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
	 *
	 * **Fallback Behavior:**
	 * - If this function is not defined, or returns `undefined` or a non-map value,
	 * the system falls back to internal `JSON.parse` logic.
	 * - If the function throws an error, it will use and empty map.
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
	 * - If `undefined`, will attempt to use `globalThis.localStorage`, if available
	 * - A custom storage that implements {@link StorageCompact} interface can also be used both in browser and NodeJS.
	 *
	 * Default:
	 * - browser: `localStorage`
	 * - node: `undefined` (in-memory mode)
	 */
	readonly storage?: StorageCompact | Storage

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
	 * - If this function is not defined, or returns `undefined` or a non-string value,
	 * the system falls back to internal `JSON.stringify` logic.
	 * - If the function throws an error, it will use and empty string.
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
	 * import { Store } from '@superutils/store'
	 *
	 * const stringify = data => {
	 *   // Convert Map to an array of entries, removing sensitive fields
	 *   const entries = Array.from(data).map(([id, user]) => {
	 *     const { password, ...publicData } = user
	 *     return [id, publicData]
	 *   })
	 *   return JSON.stringify(entries)
	 * }
	 * const storage = new Store('users', { stringify })
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
	readonly subject$: CacheDisabled extends true
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
	 *
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
	 * This operation is synchronous and does not trigger reactive updates via `subject$`.
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
	 * import { Store } from '@superutils/store'
	 *
	 * const storage = new Store('users', {
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

	/**
	 * Set item by key
	 *
	 * @param key
	 * @param value
	 *
	 * @example
	 *
	 * ```javascript
	 * import { Store } from '@superutils/store'
	 *
	 * const store = new Store<string, number>()
	 * store.set('count', 1)
	 * store.set('count', (prevCount = 0) => prevCount + 1)
	 * ```
	 */
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
