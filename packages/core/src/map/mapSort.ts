import { arrReverse } from '../arr'
import { isFn, isMap, isObj } from '../is'
import { SortConfig } from './types'

/**
 * @name	mapSort
 * @summary	create a new map sorted by value
 *
 * @param	map
 * @param	key	key of the object-value to sort by, or a comparator function
 * @param	config (optional) extra sorting configurations
 * @param	config.ignoreCase	(optional) case-insensitive sort for strings. Default: `true`
 * @param	config.reverse (optional) True: accending sort. False: descending sort. Default: `false`
 * @param	config.undefinedFirst (optional) Whether to place undefined/null values at the beginning of the sorted array.
 * Default: `false`
 *
 * @returns sorted map
 *
 * @example sort map of simple values (string/number/boolean)
 * ```typescript
 * import { mapSort } from '@superutils/core'
 * const map = new Map([
 * 	   [1, 1],
 * 	   [2, 2],
 *     [0, 0],
 * ])
 * mapSort(map)
 * // result: Map(3) { 0 => 0, 1 => 1, 2 => 2 }
 * ```
 *
 * @example sort map of objects
 * ```typescript
 * import { mapSort } from '@superutils/core'
 * const map = new Map([
 *     [0, { name: 'Charlie' }],
 *     [1, { name: 'Alice' }],
 *     [2, { name: 'Bob' }],
 * ])
 * mapSort(map, 'name')
 * // result: Map(3) {
 * //   1 => { name: 'Alice' },
 * //   2 => { name: 'Bob' },
 * //   0 => { name: 'Charlie' }
 * // }
 * ```
 */
export function mapSort<K, V extends Record<keyof any, unknown>>(
	map: Map<K, V>,
	key: keyof V & string,
	config?: SortConfig,
): Map<K, V>
export function mapSort<K, V>(
	map: Map<K, V>,
	comparator: (a: [K, V], b: [K, V]) => number,
	config?: SortConfig,
): Map<K, V>
export function mapSort<K, V extends string | boolean | number>(
	map: Map<K, V>,
	config?: SortConfig,
): Map<K, V>
export function mapSort<K, V = Record<keyof any, unknown>>(
	map: Map<K, V>,
	keyOrFn: unknown | SortConfig,
	config?: SortConfig,
) {
	if (!isMap(map)) return new Map()

	if (!isObj(config)) config = isObj<SortConfig>(keyOrFn) ? keyOrFn : {}
	const dc = mapSort.defaultConfig
	const {
		ignoreCase = dc.ignoreCase,
		newInstance = dc.newInstance,
		reverse = dc.reverse,
		undefinedFirst = dc.undefinedFirst,
	} = config
	const placeholder = undefinedFirst ? '' : 'Z'.repeat(10)
	const arr2d = Array.from(map)
	let sorted = isFn(keyOrFn)
		? arr2d.sort(keyOrFn) // use provided comparator function
		: (() => {
				const key = keyOrFn as keyof V
				const getVal = (obj: V) => {
					const value = `${(isObj(obj) && key ? obj[key] : obj) ?? placeholder}`
					return ignoreCase ? value.toLowerCase() : value
				}
				return arr2d.sort((a, b) =>
					getVal(a?.[1]) > getVal(b?.[1]) ? 1 : -1,
				)
			})()
	sorted = !reverse ? sorted : arrReverse(sorted, reverse, false)
	if (newInstance) return new Map(sorted)

	map.clear()
	for (const [key, value] of sorted) map.set(key, value)
	return map
}
/** Default sort configuration */
mapSort.defaultConfig = {
	ignoreCase: true,
	newInstance: true,
	reverse: false,
	undefinedFirst: false,
} as SortConfig
export default mapSort
