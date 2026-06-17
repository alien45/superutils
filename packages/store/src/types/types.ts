import {
	DebounceOptions,
	DropFirst,
	search,
	sort,
	SortOptions,
	ThrottleOptions,
} from '@superutils/core'

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
/** Sort parameters for sorting by map key */
export type Store_SortByKey = [byMapKey: true, options?: Store_SortOptions]
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
 *
 * @returns A string representation of the data, or `void/undefined` to trigger fallback behavior.
 */
export type Store_Stringify<T, ThisArg> = (
	this: ThisArg,
	data: T,
) => string | undefined | void

/**
 * Function signature for converting store data to an array format.
 *
 * @template Key - The type of keys in the store.
 * @template Value - The type of values in the store.
 * @template Mode - Determines the structure of the resulting array.
 *
 * @param mode - (optional) The desired array format.
 * Default: `'entries'`
 * @param data - (optional) data to convert to array.
 * Default: `store.getAll()`
 *
 * @returns An array of entries, keys, or values based on the selected mode.
 */
export type Store_ToArray<Key, Value> = (
	mode?: 'entries' | 'keys' | 'values',
	data?: Map<Key, Value>,
) => typeof mode extends 'keys'
	? Key[]
	: typeof mode extends 'values'
		? Value[]
		: [Key, Value][] // entries

/**
 * Specifies the content of the array returned by the `toArray` method.
 *
 * - `'entries'`: Returns an array of `[Key, Value]` pairs (2D Array).
 * - `'keys'`: Returns an array containing only the keys.
 * - `'values'`: Returns an array containing only the values.
 */
export type Store_ToArrayMode = 'entries' | 'keys' | 'values'

/**
 * Function signature for exporting the store content as a JSON string.
 *
 * @param replacer - A function or array that transforms the results.
 * @param spacing - Indentation or whitespace formatting.
 * @param data - The specific Map to stringify (defaults to all entries).
 *
 * @template Key - The type of keys.
 * @template Value - The type of values.
 *
 * @returns JSON string or undefined (when stringification fails)
 */
export type Store_ToJSON<Key, Value> = (
	replacer?: null | ((key: Key, value: Value) => unknown),
	spaces?: number,
	data?: null | Map<Key, Value>,
) => string | undefined

export type ObjectStore_ToJSON<Key, Value> = (
	replacer?: null | ((key: Key, value: Value) => unknown) | Key[],
	spaces?: number,
	data?: null | Map<Key, Value>,
) => string | undefined

/**
 * Defines the primary data representation used for persistence and internal serialization logic.
 *
 * - `'map'`: Data is handled and stored as a collection of entries (2D Array).
 * - `'object'`: Data is handled and stored as a plain JavaScript object.
 */
export type Store_Type = 'map' | 'object'
