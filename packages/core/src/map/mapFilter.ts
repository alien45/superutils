import fallbackIfFails from '../fallbackIfFails'
import { isFn, isMap } from '../is'

/**
 * @name	mapFilter
 * @summary Array.filter equivalent for Map.
 *
 * @param	map
 * @param	callback
 *
 * @returns new Map with filtered items
 *
 * @example
 * ```typescript
 * import { mapFilter } from '@superutils/core'
 *
 * const map = new Map<number, { name: string; age: number }>([
 * 	[1, { name: 'Alice', age: 30 }],
 * 	[2, { name: 'Bob', age: 25 }],
 * 	[3, { name: 'Charlie', age: 35 }],
 * ])
 *
 * const filtered = mapFilter(map, item => item.age >= 30)
 * // result: Map(2) {
 * //   1 => { name: 'Alice', age: 30 },
 * //   3 => { name: 'Charlie', age: 35 }
 * // }
 * ```
 */
export const mapFilter = <V = unknown, K = unknown>(
	map: Map<K, V>,
	callback: (item: V, key: K, map: Map<K, V>) => boolean,
	limit = map.size,
	result = new Map<K, V>(),
): Map<K, V> => {
	if (!isMap<K, V>(map)) return result
	if (!isFn(callback)) return map

	for (const [key, item] of map.entries()) {
		if (result.size >= limit) break
		const include = fallbackIfFails(callback, [item, key, map], false)
		include && result.set(key, item)
	}

	return result
}
export default mapFilter
