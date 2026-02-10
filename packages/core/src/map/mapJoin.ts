import { isArr2D, isMap } from '../is'

/**
 * Creates a new Map by combining two or more Maps
 *
 * @param inputs A rest parameter of Maps and/or Map-entry (key-value pair tuples) Array.
 *
 * @returns new combined Map
 *
 * @example
 * #### Join two Maps
 * ```javascript
 * import { mapJoin } from '@superutils/core'
 *
 * const map1 = new Map([['a', 1]])
 * const map2 = new Map([['b', 2]])
 * console.log(mapJoin(map1, map2))
 * // Result: Map(2) {'a' => 1, 'b' => 2}
 * ```
 *
 * @example
 * #### Join entries and Maps into a single Map
 * ```javascript
 * import { mapJoin } from '@superutils/core'
 *
 * const map1 = new Map([['a', 1]])
 * const entries = [['b', 2], ['c', 2]]
 * const map2 =	new Map([['c', 3]])
 * console.log(mapJoin(map1, entries, map2))
 * // Result: Map(2) {'a' => 1, 'b' => 2, 'c' => 3}
 * ```
 */
export const mapJoin = <K, V>(...inputs: (Map<K, V> | [K, V][])[]) =>
	new Map<K, V>(
		inputs?.flatMap?.(input =>
			isMap(input)
				? Array.from(input.entries())
				: isArr2D(input)
					? input
					: [],
		),
	)
export default mapJoin
