import { arrReverse } from '../arr'
import { isArr, isFn, isMap, isObj, isSet } from '../is'
import { IterableList, SortOptions } from './types'

export type EntryComparator<K, V> = (a: [K, V], b: [K, V]) => number
export type ArrayComparator<V> = (a: V, b: V) => number

/**
 * Sort iterable lists (Array/Map/Set).
 *
 *
 * @param data
 * @param propertyName Accepted values:
 * - `string`: value object property name
 * - `function`: comparator function. Recommended for performance.
 * - `true`: indicates to sort by Map keys instead of values.
 * @param options (optional) extra sorting opitons
 * @param options.ignoreCase	(optional) case-insensitive sort for strings. Default: `true`
 * @param options.reverse (optional) True: accending sort. False: descending sort. Default: `false`
 * @param options.undefinedFirst (optional) Where to place undefined/null values.
 * Not avaible when `comparator` function is used.
 * - `true`: at the beginning
 * - `false`: at the end
 *
 * Default: `false`
 *
 * @returns sorted map
 *
 * @example sort map of simple values (string/number/boolean)
 * ```typescript
 * import { sort } from '@superutils/core'
 * const map = new Map([
 * 	   [1, 1],
 * 	   [2, 2],
 *     [0, 0],
 * ])
 * sort(map)
 * // result: Map(3) { 0 => 0, 1 => 1, 2 => 2 }
 * ```
 *
 * @example sort map of objects
 * ```typescript
 * import { sort } from '@superutils/core'
 * const map = new Map([
 *     [0, { name: 'Charlie' }],
 *     [1, { name: 'Alice' }],
 *     [2, { name: 'Bob' }],
 * ])
 * sort(map, 'name')
 * // result: Map(3) {
 * //   1 => { name: 'Alice' },
 * //   2 => { name: 'Bob' },
 * //   0 => { name: 'Charlie' }
 * // }
 * ```
 */
export function sort<
	K,
	V extends Record<PropertyKey, unknown>,
	T extends IterableList<K, V>,
>(data: T, propertyName: keyof V & string, options?: SortOptions): T
/** Sort `Map` by map-keys `K` */
export function sort<K, V>(
	data: Map<K, V>,
	byKey: true,
	options?: SortOptions,
): Map<K, V>
/** Sort `Map` with comparator function */
export function sort<K, V>(
	map: Map<K, V>,
	comparator: EntryComparator<K, V>,
	options?: SortOptions,
): Map<K, V>
/** Sort `Array` with comparator function */
export function sort<V>(
	array: V[],
	comparator: ArrayComparator<V>,
	options?: SortOptions,
): V[]
/** Sort `Set` with comparator function */
export function sort<V>(
	set: Set<V>,
	comparator: ArrayComparator<V>,
	options?: SortOptions,
): Set<V>
/** Sort Array/Map/Set with `string | boolean | number` values */
export function sort<
	K,
	V extends string | boolean | number,
	T extends IterableList<K, V>,
>(data: T, options?: SortOptions): T
export function sort<
	K,
	V = Record<PropertyKey, unknown>,
	T extends IterableList<K, V> = IterableList<K, V>,
>(
	data: T,
	keyOrFn?:
		| true
		| (keyof V & string)
		| SortOptions
		| (T extends V[] ? ArrayComparator<V> : EntryComparator<K, V>),
	options?: SortOptions,
) {
	const dataType = isArr(data) ? 1 : isMap(data) ? 2 : isSet(data) ? 3 : 0
	if (!dataType) return data

	const { ignoreCase, newInstance, reverse, undefinedFirst } = {
		...sort.defaultOptions,
		...(isObj(options)
			? options
			: isObj<SortOptions>(keyOrFn)
				? keyOrFn
				: {}),
	}

	if (dataType === 1 && isFn(keyOrFn)) {
		// comparator function received
		return arrReverse(
			(data as V[]).sort(keyOrFn as (a: V, b: V) => number), // use provided comparator function
			reverse,
			newInstance,
		)
	}

	const alt = undefinedFirst ? '' : 'Z'.repeat(10)
	const sorted = isFn(keyOrFn)
		? arrReverse(
				// handle Set with comparator function
				[...data.entries()].sort(keyOrFn as EntryComparator<K, V>),
				reverse,
				false, // not required because of entries() & spread
			)
		: (() => {
				const key = keyOrFn as keyof V
				const getVal = (obj: unknown) => {
					const value = `${((isObj(obj) && key ? obj[key as keyof typeof obj] : obj) as string) ?? alt}`
					return ignoreCase ? value.toLowerCase() : value
				}
				// 0 => sort by map-key, 1 => sort by map-value
				const index = keyOrFn === true ? 0 : 1
				const [gt, lt] = reverse ? [-1, 1] : [1, -1]

				// hande Array & Set
				if ([1, 3].includes(dataType)) {
					return (
						(dataType === 3 || newInstance
							? [...(data as V[])]
							: data) as V[]
					).sort((a, b) => (getVal(a) > getVal(b) ? gt : lt))
				}

				// handle Map
				return [...data.entries()].sort((a: [K, V], b: [K, V]) =>
					getVal(a?.[index]) > getVal(b?.[index]) ? gt : lt,
				)
			})()
	if (dataType === 1) return sorted
	if (newInstance) {
		return dataType === 2
			? new Map(sorted as [K, V][])
			: new Set(sorted as V[])
	}

	// Clear original list values
	;(data as Map<K, V>).clear()

	// re-enter the values in sorted order
	for (const entry of sorted)
		dataType === 2
			? (data as Map<K, V>).set(...(entry as [K, V]))
			: (data as Set<V>).add(entry as V)
	return data
}
/** Default sort options */
sort.defaultOptions = {
	ignoreCase: true,
	newInstance: false,
	reverse: false,
	undefinedFirst: false,
} satisfies SortOptions
export default sort
