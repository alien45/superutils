import { arrReverse } from '../arr'
import { isFn, isMap, isObj } from '../is'
import { SortConfig } from './types'

/**
 * @name	mapSort
 * @summary	create a new map sorted by value
 *
 * @param	map
 * @param	propertyName	key of the object-value to sort by, or a comparator function
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
export function mapSort<K, V extends string | boolean | number>(
	map: Map<K, V>,
	config?: SortConfig,
): Map<K, V>
export function mapSort<K, V extends Record<keyof any, unknown>>(
	map: Map<K, V>,
	propertyName: keyof V & string,
	config?: SortConfig,
): Map<K, V>
export function mapSort<K, V>(
	map: Map<K, V>,
	/** Sort by map key */
	byKey: true,
	config?: SortConfig,
): Map<K, V>
export function mapSort<K, V>(
	map: Map<K, V>,
	comparator: (a: [K, V], b: [K, V]) => number,
	config?: SortConfig,
): Map<K, V>
export function mapSort<K, V = Record<keyof any, unknown>>(
	map: Map<K, V>,
	keyOrFn: unknown | true | SortConfig,
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
	const sorted = isFn(keyOrFn)
		? Array.from(map).sort(keyOrFn) // use provided comparator function
		: (() => {
				const key = keyOrFn as keyof V
				const getVal = (obj: unknown) => {
					const v =
						(isObj(obj) && key ? obj[key as keyof typeof obj] : obj)
						?? placeholder
					const value = `${v}`
					return ignoreCase ? value.toLowerCase() : value
				}
				// 0 => sort by map-key, 1 => sort by map-value
				const index = keyOrFn === true ? 0 : 1
				const [gt, lt] = reverse ? [-1, 1] : [1, -1]
				return Array.from(map).sort((a, b) =>
					getVal(a?.[index]) > getVal(b?.[index]) ? gt : lt,
				)
			})()
	if (newInstance) return new Map(sorted)

	map.clear()
	for (const [key, value] of sorted) map.set(key, value)
	return map
}
/** Default sort configuration */
mapSort.defaultConfig = {
	ignoreCase: true,
	newInstance: false,
	reverse: false,
	undefinedFirst: false,
} satisfies SortConfig
export default mapSort
