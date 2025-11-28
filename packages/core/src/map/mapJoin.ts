import { isArr2D, isMap } from '../is'

/**
 * Creates a new Map by combining two or more Maps
 *
 * @param inputs A rest parameter of Maps and/or Map-entry (key-value pair tuples) Array.
 *
 * @returns new combined Map
 *
 * @example Join two Maps
 * ```typescript
 * import { mapJoin } from '@superutils/core'
 *
 * const maps = [
 * 	new Map([['a', 1]]),
 * 	new Map([['b', 2]]),
 * ]
 * const joined = mapJoin(...maps)
 * // Result: Map(2) {'a' => 1, 'b' => 2}
 * ```
 *
 * @example Join entries and Maps into a single Map
 * ```typescript
 * import { mapJoin } from '@superutils/core'
 *
 * const joined = mapJoin(
 * 	new Map([['a', 1]]),
 * 	[['b', 2]],
 * 	new Map([['c', 3]]),
 * )
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
