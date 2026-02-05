import fallbackIfFails from '../fallbackIfFails'
import { isMap, isPositiveInteger } from '../is'
import { IterableList } from './types'

/**
 * Filter {@link IterableList} (Array, Map, Set) items.
 *
 * @param data
 * @param predicate callback function to filter values
 * Parameters:
 * 1. `item`: current item
 * 2. `key`: index/key
 * 3. `data`: value provided in the first argument (`data`)
 * @param limit	(optional) limit number of results
 * @param asArray
 *
 * @returns new Map with filtered items
 *
 * @example
 * ```typescript
 * import { filter } from '@superutils/core'
 *
 * const map = new Map<number, { name: string; age: number }>([
 * 	[1, { name: 'Alice', age: 30 }],
 * 	[2, { name: 'Bob', age: 25 }],
 * 	[3, { name: 'Charlie', age: 35 }],
 * ])
 *
 * const filtered = filter(map, item => item.age >= 30)
 * console.log({ filtered })
 * // result: Map(2) {
 * //   1 => { name: 'Alice', age: 30 },
 * //   3 => { name: 'Charlie', age: 35 }
 * // }
 * ```
 */
export const filter = <
	K,
	V,
	AsArray extends boolean = false,
	Result = AsArray extends true ? V[] : Map<K, V>,
>(
	data: IterableList<K, V>,
	predicate: (item: V, key: K, data: IterableList<K, V>) => boolean,
	limit?: number,
	asArray?: AsArray,
	result?: Map<K, V>,
): Result => {
	if (!isMap(result)) result = new Map()

	if (!isPositiveInteger(limit)) limit = Infinity
	for (const [key, item] of data?.entries?.() || []) {
		if (result.size >= limit) break

		fallbackIfFails(predicate ?? item, [item, key, data], false)
			&& result.set(key, item)
	}

	return (asArray ? [...result.values()] : result) as Result
}
export default filter
