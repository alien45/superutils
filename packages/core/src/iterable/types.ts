/** A general type helper to capture all iterables like Array, Map, Set.... */
export type IterableList<K = unknown, V = unknown> = {
	entries: () => IterableIterator<[K, V]>
	hasOwnProperty: (name: string) => boolean
	keys: () => IterableIterator<K>
	values: () => IterableIterator<V>
} & ({ size: number } | { length: number })

/** Return the appropriate type if `Array | Map | Set`  */
export type IterableType<T, Fallback = T> = T extends (infer V)[]
	? V[]
	: T extends Set<infer V>
		? Set<V>
		: T extends Map<infer K, infer V>
			? Map<K, V>
			: Fallback

/** Configuration for sorting iterables */
export type SortOptions = {
	ignoreCase?: boolean
	/**
	 * Whether to create a new instance of preserve original reference
	 *
	 * Default: `true` for Array, `false` for Map.
	 */
	newInstance?: boolean
	/** Reverse sorted result */
	reverse?: boolean
	/**
	 * Whether to place undefined/null values at the beginning of the sorted array.
	 *
	 * Default: `false`
	 */
	undefinedFirst?: boolean
}

/** Search criteria for searcheing iterables */
export type SearchOptions<K, V, AsMap extends boolean = false> = {
	/** Whethere to return the result as a map (`true`) or array (`false`). Default: `true` */
	asMap?: AsMap
	/** case-insensitive search for strings. Default: `false` */
	ignoreCase?: boolean
	/** limit number of results. Default: `Infinity` */
	limit?: number
	/** partial match for values. Default: `false` */
	matchExact?: boolean
	/** match all supplied key-value pairs. Default: `false` */
	matchAll?: boolean
	/** key-value pairs */
	query: Record<string, unknown> | string
	/** Map to store results in. Default: `new Map()` */
	result?: Map<K, V>
	/** Callback to convert item/item-property to string */
	transform?: (
		/** List item */
		item: V,
		/** Item property value or `undefined` for fuzzy search. */
		value?: V[keyof V],
		/** Item property key provided by query or `undefined` for fuzzy search. */
		key?: keyof V,
	) => string
}
