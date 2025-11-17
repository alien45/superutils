import { arrReverse } from '../arr'
import { isArr, isFn, isObj } from '../is'
import { SortConfig } from '../map'

/**
 * @name	arrSort
 * @summary	create a new map sorted by value-key
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
 * import { arrSort } from '@superutils/core'
 * const map = new Map([
 * 	   [1, 1],
 * 	   [2, 2],
 *     [0, 0],
 * ])
 * arrSort(map)
 * // result: Map(3) { 0 => 0, 1 => 1, 2 => 2 }
 * ```
 *
 * @example sort map of objects
 * ```typescript
 * import { arrSort } from '@superutils/core'
 * const map = new Map([
 *     [0, { name: 'Charlie' }],
 *     [1, { name: 'Alice' }],
 *     [2, { name: 'Bob' }],
 * ])
 * arrSort(map, 'name')
 * // result: Map(3) {
 * //   1 => { name: 'Alice' },
 * //   2 => { name: 'Bob' },
 * //   0 => { name: 'Charlie' }
 * // }
 * ```
 */
export function arrSort<V extends Record<keyof any, unknown>>(
	arr: V[],
	key: keyof V & string,
	config?: SortConfig,
): V[]
export function arrSort<K, V>(
	arr: V[],
	comparator: (a: V, b: V) => number,
	config?: SortConfig,
): V[]
export function arrSort<K, V extends string | boolean | number>(
	arr: V[],
	config?: SortConfig,
): V[]
export function arrSort<K extends keyof any, V = Record<K, unknown>>(
	arr: V[],
	keyOrFn: unknown | SortConfig,
	config?: SortConfig,
) {
	if (!isArr(arr)) return []

	if (!isObj(config)) config = isObj<SortConfig>(keyOrFn) ? keyOrFn : {}
	const dc = arrSort.defaultConfig
	const {
		ignoreCase = dc.ignoreCase,
		newInstance = dc.newInstance,
		reverse = dc.reverse,
		undefinedFirst = dc.undefinedFirst,
	} = config
	const placeholder = undefinedFirst ? '' : 'Z'.repeat(10)
	const sorted = isFn(keyOrFn)
		? arr.sort(keyOrFn) // use provided comparator function
		: (() => {
				const key = keyOrFn as keyof V
				const getVal = (obj: V) => {
					const value = `${(isObj(obj) && key ? obj[key] : obj) ?? placeholder}`
					return ignoreCase ? value.toLowerCase() : value
				}
				return arr.sort((a, b) => (getVal(a) > getVal(b) ? 1 : -1))
			})()
	return arrReverse(sorted, reverse, newInstance)
}
/** Default sort configuration */
arrSort.defaultConfig = {
	ignoreCase: true,
	newInstance: true,
	reverse: false,
	undefinedFirst: false,
} as SortConfig
export default arrSort
