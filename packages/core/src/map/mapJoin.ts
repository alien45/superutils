import { isArr2D, isMap } from '../is'

/**
 * @name	mapJoin
 * @summary creates a new Map by combining two or more Maps
 *
 * @param	{Map[]|Array[]} maps...
 *
 * @returns {Map}
 *
 * @example
 * ```typescript
 * const maps = [
 * 	new Map([['a', 1]]),
 * 	new Map([['b', 2]]),
 * ]
 * const joined = mapJoin(...maps) // Map(2) {'a' => 1, 'b' => 2}
 *
 * // use 2D array
 * const maps = [
 * 	[['a', 1]],
 * 	[['b', 2]],
 * ]
 * const joined = mapJoin(...maps) // Map(2) {'a' => 1, 'b' => 2}
 * ```
 */
export const mapJoin = <K, V>(...inputs: Array<Map<K, V> | [K, V][]>) =>
	new Map<K, V>(
		inputs.flatMap(input =>
			isMap(input)
				? Array.from(input.entries())
				: isArr2D(input)
					? input
					: [],
		),
	)
