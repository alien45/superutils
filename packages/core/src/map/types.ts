/** Configuration for Map and Array sort functions */
export type SortConfig = {
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

/** Configuration for Map and Array search functions */
export type SearchConfig<K, V, AsMap extends boolean = false> = {
	asMap?: AsMap
	/** key-value pairs */
	query?: Record<string, unknown>
	/** case-insensitive search for strings. Default: `false` */
	ignoreCase?: boolean
	/** limit number of results. Default: `Infinity` */
	limit?: number
	/** partial match for values. Default: `false` */
	matchExact?: boolean
	/** match all supplied key-value pairs. Default: `false` */
	matchAll?: boolean
	/** Map to store results in. Default: `new Map()` */
	result?: Map<K, V>
}
