import mapSearch from './mapSearch'
import { SearchConfig } from './types'

/**
 * @name	mapFind
 * @summary finds a specific object by supplied object property/key and value within.
 *
 * @returns first item matched or `undefined` if not found
 *
 * @example
 * ```typescript
 * import { mapFindByKey } from '@superutils/core'
 *
 * const map = new Map<number, { name: string; age: number }>([
 * 	[1, { name: 'Alice', age: 30 }],
 * 	[2, { name: 'Bob', age: 25 }],
 * 	[3, { name: 'Charlie', age: 35 }],
 * ])
 *	const result = mapFind(testmap, {
 *		query: 'Bob',
 *		key: 'name',
 *	})
 * // result: { name: 'Bob', age: 25 }
 * ```
 */
export const mapFind = <
	K,
	V extends Record<string, unknown>,
	IncludeKey extends boolean = false,
	Return = undefined | (IncludeKey extends true ? [K, V] : V),
>(
	map: Map<K, V> | V[],
	search: Omit<SearchConfig<K, V>, 'limit'> & {
		/**
		 * Whether to include the key in the return type.
		 *
		 * If `true`, return type is `[K, V]` else `V`
		 *
		 * Default: `false`
		 */
		includeKey?: IncludeKey
	},
): Return => {
	const result = mapSearch(map, { ...search, limit: 1 })
	const item = Array.from(result)[0]
	return (search?.includeKey ? item : item?.[1]) as Return
}
