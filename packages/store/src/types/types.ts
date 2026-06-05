import {
	DebounceOptions,
	DropFirst,
	search,
	sort,
	SortOptions,
	ThrottleOptions,
} from '@superutils/core'
import { IStore } from './IStore'

/** Bare miminal storage with only properties that are used by `Store` */
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
 * Categorizes errors encountered during Store operations.
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
	 * Default: `undefined`
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
> & {
		/**
		 * If `true`, storage validation is delayed until initialization.
		 *
		 * By default, if a `name` is provided, the constructor throws an error if no valid
		 * storage mechanism (like `localStorage`) is found. Enabling this allows the
		 * instance to be created even if storage is temporarily missing, throwing the error
		 * only when `init()` is called - manually, on first read/write, or automatically
		 * when non-empty `initialValue` is provided..
		 *
		 * Default: `false`
		 */
		checkStorageOnInit?: boolean
	} & (CacheDisabled extends false
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
