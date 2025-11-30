/** Configuration for finding {@link IterableList} items */
export type FindOptions<K, V, IncludeKey extends boolean = false> = Omit<
	SearchOptions<K, V>,
	'limit' | 'asMap'
> & {
	/**
	 * Whether to include the key in the return type.
	 *
	 * If `true`, return type is `[K, V]` else `V`
	 *
	 * Default: `false`
	 */
	includeKey?: IncludeKey
}

/** A general type to capture all iterables like Array, Map, Set.... */
export type IterableList<K = unknown, V = unknown> = {
	entries: () => IterableIterator<[K, V]>
	hasOwnProperty: (name: string) => boolean
	keys: () => IterableIterator<K>
	values: () => IterableIterator<V>
} & ({ clear: () => void; size: number } | { length: number })

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
	query: Record<string, unknown> | string | RegExp
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
	) => string | undefined
}
