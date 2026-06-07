import {
	DebounceOptions,
	DropFirst,
	search,
	sort,
	SortOptions,
	ThrottleOptions,
} from '@superutils/core'
import { IStore } from './IStore'

/**
 * Represents the minimal subset of the `Storage` interface required for persistence.
 *
 * Any object implementing this type can be used as a storage engine, making the Store
 * compatible with `localStorage`, `sessionStorage`, or custom file-based implementations.
 */
export type StorageCompact = Pick<Storage, 'getItem' | 'setItem'>

/**
 * Configuration for the timing strategy used when writing data to persistent storage.
 */
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

/**
 * Configuration options for initializing a {@link Store} or {@link ObjectStore}.
 *
 * These options define the behavior of caching, persistence, error handling, and validation.
 */
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
	| 'validate'
>
	& (CacheDisabled extends false
		? Pick<
				Partial<IStore<Key, Value, CacheDisabled>>,
				'delay' | 'delayOptions'
			>
		: { delay?: never; delayOptions?: never })

/**
 * Function signature for custom data deserialization.
 *
 * @param text The raw string retrieved from the underlying storage.
 * @returns The parsed data structure (usually a Map) or `void` to trigger fallback behavior.
 */
export type Store_Parse<ResultMap, ThisArg> = (
	this: ThisArg,
	text: string | null | undefined,
) => ResultMap | void

/**
 * Function signature for the internal search utility.
 *
 * @template K - The type of keys.
 * @template V - The type of values.
 * @template MatchExact - Whether to perform exact matching.
 * @template AsMap - Whether to return results as a Map.
 */
export type Store_Search<
	K,
	V,
	MatchExact extends boolean = false,
	AsMap extends boolean = true,
> = (
	...args: DropFirst<Parameters<typeof search<K, V, MatchExact, AsMap>>>
) => ReturnType<typeof search<K, V, MatchExact, AsMap>>

/**
 * Function Signature for the sort utility, supporting multiple sorting strategies:
 * 1. By a custom comparator function.
 * 2. By a specific property name (for object-like values).
 * 3. By the map keys.
 *
 * @template K - The type of keys.
 * @template V - The type of values.
 */
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

/** Configuration options for sorting, including whether to persist the result. */
export type Store_SortOptions = SortOptions & { save?: boolean }

/**
 * Function signature for custom data serialization.
 *
 * @param data The current data structure to be serialized.
 * @returns A string representation of the data, or `void/undefined` to trigger fallback behavior.
 */
export type Store_Stringify<Data, ThisArg> = (
	this: ThisArg,
	data: Data,
) => string | undefined | void

/**
 * Function signature for exporting the store content as a JSON string.
 *
 * @param replacer - A function or array that transforms the results.
 * @param spacing - Indentation or whitespace formatting.
 * @param data - The specific Map to stringify (defaults to all entries).
 *
 * @template K - The type of keys.
 * @template V - The type of values.
 */
export type Store_ToJSON<K, V> = (
	replacer?: null | ((key: K, value: V) => unknown),
	spacing?: string | number,
	data?: Map<K, V>,
) => string
