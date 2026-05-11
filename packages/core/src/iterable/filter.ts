import fallbackIfFails from '../fallbackIfFails'
import { isMap, isPositiveInteger } from '../is'
import { IterableList } from './types'

/**
 * Filters items from an {@link IterableList} (Array, Map, or Set).
 *
 * @param data The iterable collection to filter.
 * @param predicate A function to test each element. Receives `(item, key, data)`.
 * @param limit (optional) maximum number of results to return. Defaults to `Infinity`.
 * @param asMap (optional) Whether to transform the result to an array or a map:
 * - `false`: array of values.
 * - `true` (default): Map with resptective keys/indexes preserved as map keys
 * @param result (optional) existing Map instance to populate.
 *
 * @template K The type of keys (Map) or indices (Array/Set) in the collection.
 * @template V The type of values in the collection.
 * @template AsMap Literal type determining whether the output is an Array or Map.
 * @template Result The inferred return type (Map<K, V> or V[]).
 *
 * Default: `false`
 *
 * @returns new Map with filtered items
 *
 * @example filter a Map
 * ```typescript
 * import { filter } from '@superutils/core'
 *
 * const map = new Map<number, { name: string; age: number }>([
 * 	[1, { name: 'Alice', age: 30 }],
 * 	[2, { name: 'Bob', age: 25 }],
 * 	[3, { name: 'Charlie', age: 35 }],
 * ])
 *
 * // Result as a map  (default)
 * console.log(filter(map, item => item.age >= 30))
 * // Prints: Map(2) { 1 => { name: 'Alice', age: 30 }, 3 => { name: 'Charlie', age: 35 } }
 *
 * // Result as an array
 * console.log(filter(map, item => item.age >= 30), false)
 * // Prints: [{ name: 'Alice', age: 30 }, { name: 'Charlie', age: 35 }]
 * ```
 *
 * @example
 * #### Filter an Array
 * ```typescript
 * import { filter } from '@superutils/core'
 *
 * const numbers = [10, 20, 30, 40, 50]
 *
 * // Result as a map (default)
 * console.log(filter(numbers, n => n > 25, 2))
 * // Prints: Map(2) { 2 => 30, 3 => 40 }
 *
 * // Result as an array
 * console.log(filter(numbers, n => n > 25, 2, false))
 * // Prints: [30, 40]
 * ```
 */
export const filter = <
	K,
	V,
	AsMap extends boolean = false,
	Result = AsMap extends true ? Map<K, V> : V[],
>(
	data: IterableList<K, V>,
	predicate: (item: V, key: K, data: IterableList<K, V>) => boolean,
	limit?: number,
	asMap?: AsMap,
	result?: Map<K, V>,
): Result => {
	if (!isMap(result)) result = new Map()

	if (!isPositiveInteger(limit)) limit = Infinity
	for (const [key, item] of data?.entries?.() || []) {
		if (result.size >= limit) break

		fallbackIfFails(predicate ?? item, [item, key, data], false)
			&& result.set(key, item)
	}

	return (asMap ? result : [...result.values()]) as Result
}
export default filter
