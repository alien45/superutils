import fallbackIfFails from '../fallbackIfFails'
import { isArrLike, isEmpty, isFn, isMap, isObj, isRegExp, isStr } from '../is'
import { objCopy, objCreate } from '../obj'
import getSize from './getSize'
import getValues from './getValues'
import { IterableList, SearchOptions } from './types'

/**
 * A versatile utility for searching through an iterable list (e.g., Array, Map, Set) of objects.
 * It supports both a simple "fuzzy" search with a string query across all properties and a
 * detailed, field-specific search using a query object.
 *
 * @param data The list of objects to search within. Compatible types include:
 * - `Array`
 * - `Map`
 * - `Set`
 * - `NodeList` (in DOM environments): `options.transform()` required
 * - `HTMLCollection` (in DOM environments): should accompany `options.transform()`
 * @param options The search criteria.
 * @param options.query The search query. Can be a string to search all fields, or an object for field-specific
 * searches (e.g., `{ name: 'John', city: 'New York' }`).
 * @param options.asMap (optional) If `true`, returns a `Map`. If `false`, returns an `Array`. Default: `true`.
 * @param options.ignoreCase (optional) If `true`, performs a case-insensitive search for strings. Default: `true`.
 * @param options.limit (optional) The maximum number of results to return. Default: `Infinity`.
 * @param options.matchAll (optional) If `true`, an item must match all key-value pairs in the `query` object. If
 * `false`, it matches if at least one pair is found. Default: `false`.
 * @param options.matchExact (optional) If `true`, performs an exact match. If `false`, performs a partial match
 * (i.e., `includes()`). Default: `false`.
 * @param options.result (optional) An optional `Map` to which the results will be added.
 * @param options.transform (optional) Callback to transform item/item-property to string
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
	V, // extends Record<string, unknown>,
	AsMap extends boolean = true,
	Result = AsMap extends true ? Map<K, V> : V[],
>(
	data: IterableList<K, V>,
	options: SearchOptions<K, V, AsMap>,
): Result => {
	const ignore = !getSize(data) || isEmpty(options?.query) // object: no properties | string: only whitespaces
	const result = isMap(options?.result) ? options.result : new Map()
	const asMap = options?.asMap ?? search.defaultOptions.asMap
	if (ignore) return (asMap ? result : getValues(result)) as Result

	options = objCopy(search.defaultOptions, options, [], 'empty') as Required<
		SearchOptions<K, V, AsMap>
	>
	const { ignoreCase, limit = Infinity, matchAll, matchExact } = options
	let { query } = options

	const qIsStr = isStr(query)
	const qIsRegExp = !qIsStr && isRegExp(query)
	const qKeys = fallbackIfFails(Object.keys, [query], [])
	// Pre-process keywords for case-insensitivity outside the main loop
	if (ignoreCase && !matchExact && !qIsRegExp) {
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
	const entries = data.entries()
	for (const [dataKey, dataValue] of entries) {
		if (result.size >= limit) break

		const matched =
			qIsStr || qIsRegExp
				? matchItemOrProp(options, dataValue, undefined) // fuzzy search
				: qKeys[matchAll ? 'every' : 'some'](
						key => matchItemOrProp(options, dataValue, key), // search specific properties
					)
		if (!matched) continue

		result.set(dataKey, dataValue)
	}
	return (asMap ? result : getValues(result)) as Result
}
search.defaultOptions = {
	asMap: true,
	ignoreCase: true,
	limit: Infinity,
	matchAll: false,
	matchExact: false,
} as Pick<
	// options that should always have default value
	Required<SearchOptions<unknown, unknown, true>>,
	'asMap' | 'ignoreCase' | 'limit' | 'matchAll' | 'matchExact'
>

/** Utility for use with {@link search} function */
export function matchItemOrProp<K, V>( // extends Record<string, unknown>
	{
		query,
		ignoreCase,
		matchExact,
		transform,
	}: Pick<
		SearchOptions<K, V, boolean>,
		'transform' | 'query' | 'ignoreCase' | 'matchExact'
	>,
	item: V,
	propertyName?: string,
) {
	const fuzzy = isStr(query) || isRegExp(query) || propertyName === undefined
	const keyword = fuzzy ? query : query[propertyName]
	const propVal: unknown =
		fuzzy || !isObj(item)
			? item
			: (item as Record<string, unknown>)[propertyName]
	let value = fallbackIfFails(
		() =>
			isFn(transform)
				? transform(
						item,
						fuzzy ? undefined : (propVal as V[keyof V]),
						propertyName as keyof V,
					)
				: isObj(propVal, false)
					? JSON.stringify(
							isArrLike(propVal)
								? [...propVal.values()]
								: Object.values(propVal),
						)
					: propVal?.toString?.(),
		[],
		'',
	)
	if (!value?.trim()) return false
	if (isRegExp(keyword)) return keyword.test(`${value}`)
	if (ignoreCase && !matchExact) value = value.toLowerCase()
	if (value === keyword) return true

	return !matchExact && `${value}`.includes(String(keyword))
}

export default search
