import fallbackIfFails from '../fallbackIfFails'
import { isArrLike, isEmpty, isFn, isMap, isObj, isRegExp, isStr } from '../is'
import { objCopy, objCreate } from '../obj'
import { mapValues } from '../map'
import getSize from './getSize'
import { IterableList, SearchOptions } from './types'

/** Utility for use with {@link search()} function */
const matchItemCb =
	<K, V extends Record<string, unknown>>(
		options: SearchOptions<K, V, boolean>,
		item: V,
	) =>
	(key?: string): boolean => {
		if (!isObj(item)) return false

		const query = options.query as Record<string, unknown>
		const { propToStr, ignoreCase, matchExact } = options
		const keyword = key === undefined ? query : query[key]
		const propVal = key === undefined ? item : (item[key] ?? '')
		let value = fallbackIfFails(
			() =>
				isObj(propVal, false)
					? isFn(propToStr)
						? propToStr(
								item,
								key === undefined ? [] : [propVal, key],
							)
						: JSON.stringify(
								isArrLike(propVal)
									? [...propVal.values()]
									: propVal,
							)
					: `${(propVal as string) ?? ''}`,
			[],
			'',
		)
		if (!value) return false
		if (isRegExp(keyword)) return keyword.test(`${value}`)
		if (ignoreCase && !matchExact) value = value.toLowerCase()
		if (value === keyword) return true

		return !matchExact && `${value}`.includes(keyword as string)
	}

/**
 * A versatile utility for searching through an iterable list (e.g., Array, Map, Set) of objects.
 * It supports both a simple "fuzzy" search with a string query across all properties and a
 * detailed, field-specific search using a query object.
 *
 * @param data The list of objects to search within. Compatible types include:
 * - `Array`
 * - `Map`
 * - `Set`
 * - `NodeList` (in DOM environments)
 * - `HTMLCollection` (in DOM environments)
 * @param options The search criteria.
 * @param options.query The search query. Can be a string to search all fields, or an object for field-specific searches (e.g., `{ name: 'John', city: 'New York' }`).
 * @param options.asMap (optional) If `true`, returns a `Map`. If `false`, returns an `Array`. Default: `true`.
 * @param options.ignoreCase (optional) If `true`, performs a case-insensitive search for strings. Default: `true`.
 * @param options.limit (optional) The maximum number of results to return. Default: `Infinity`.
 * @param options.matchAll (optional) If `true`, an item must match all key-value pairs in the `query` object. If `false`, it matches if at least one pair is found. Default: `false`.
 * @param options.matchExact (optional) If `true`, performs an exact match. If `false`, performs a partial match (i.e., `includes()`). Default: `false`.
 * @param options.result (optional) An optional `Map` to which the results will be added.
 * @param options.propToStr (optional) A function to customize how object properties are converted to strings for searching.
 *
 * @returns A `Map` or an `Array` containing the matched items, based on the `asMap` option.
 *
 * @example
 * ```typescript
 * const users = [
 *   { id: 1, name: 'John Doe', city: 'New York' },
 *   { id: 2, name: 'Jane Doe', city: 'London' },
 *   { id: 3, name: 'Peter Jones', city: 'New York' },
 * ];
 *
 * // Simple string search (case-insensitive, partial match by default)
 * const doeUsers = search(users, { query: 'doe' });
 * // Returns: [{ id: 1, ... }, { id: 2, ... }]
 *
 * // Field-specific search, requiring all fields to match
 * const peterInNY = search(users, {
 *   query: { name: 'Peter', city: 'New York' },
 *   matchAll: true,
 * });
 * // Returns: [{ id: 3, ... }]
 * ```
 */
export const search = <
	K,
	V extends Record<string, unknown>,
	AsMap extends boolean = true,
	Result = AsMap extends true ? Map<K, V> : V[],
>(
	data: IterableList<K, V>,
	options: SearchOptions<K, V, AsMap>,
): Result => {
	const ignore = !getSize(data) || isEmpty(options?.query)
	const result = isMap(options?.result) ? options.result : new Map()
	const asMap = options?.asMap ?? true
	if (ignore) return (asMap ? result : mapValues(result)) as Result

	options = objCopy(search.defaultOptions, options, [], 'empty') as Required<
		SearchOptions<K, V, AsMap>
	>
	const { ignoreCase, limit = Infinity, matchAll, matchExact } = options
	let { query } = options

	const qIsStr = isStr(query)
	const qKeys = Object.keys(query)
	// Pre-process keywords for case-insensitivity outside the main loop
	if (ignoreCase && !matchExact) {
		query = qIsStr
			? (query as string).toLowerCase()
			: objCreate(
					qKeys,
					Object.values(query).map(x =>
						isRegExp(x) ? x : `${x as string}`.toLowerCase(),
					),
				)
	}

	options.query = query
	for (const [dataKey, dataValue] of data.entries()) {
		if (result.size >= limit) break

		const matched = qIsStr
			? matchItemCb(options, dataValue)(undefined)
			: qKeys[matchAll ? 'every' : 'some'](
					matchItemCb(options, dataValue),
				)
		if (!matched) continue

		result.set(dataKey, dataValue)
	}
	return (asMap ? result : mapValues(result)) as Result
}
search.defaultOptions = {
	asMap: true,
	ignoreCase: true,
	limit: Infinity,
	matchAll: false,
	matchExact: false,
} as Required<SearchOptions<unknown, unknown, true>>

export default search
