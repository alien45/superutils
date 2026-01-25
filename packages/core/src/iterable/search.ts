import fallbackIfFails from '../fallbackIfFails'
import { isArrLike, isEmpty, isFn, isMap, isObj, isRegExp, isStr } from '../is'
import { objCopy, objCreate } from '../obj'
import getSize from './getSize'
import getValues from './getValues'
import { IterableList, SearchOptions } from './types'

/**
 * A versatile utility for searching through an iterable list (Array, Map, or Set) of objects.
 * It supports both a global search (using a string or RegExp) across all properties of an item, and a
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
 * @param options.ranked (optional) If `true`, the results are sorted by relevance (match index). Default: `false`.
 *
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
	MatchExact extends boolean = false,
	AsMap extends boolean = true,
	Result = AsMap extends true ? Map<K, V> : V[],
>(
	data: IterableList<K, V>,
	options: SearchOptions<K, V, MatchExact, AsMap>,
): Result => {
	const ignore = !getSize(data) || isEmpty(options?.query) // object: no properties | string: only whitespaces
	const result = isMap(options?.result) ? options.result : new Map()
	const asMap = options?.asMap ?? search.defaultOptions.asMap
	if (ignore) return (asMap ? result : getValues(result)) as Result

	options = objCopy(
		search.defaultOptions,
		options,
		[],
		'empty', // override `option` property with default value when "empty" (undefined, null, '',....)
	) as typeof options
	const {
		ignoreCase,
		limit = Infinity,
		matchAll,
		matchExact,
		ranked,
	} = options
	let { query } = options

	const qIsStr = isStr(query)
	const qIsRegExp = isRegExp(query)
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

	if (!ranked) {
		for (const [dataKey, dataValue] of data.entries()) {
			if (result.size >= limit) break

			const matched =
				qIsStr || qIsRegExp
					? // global search across all properties
						matchObjOrProp(options, dataValue, undefined) >= 0
					: // field-specific search
						qKeys[matchAll ? 'every' : 'some'](
							key => matchObjOrProp(options, dataValue, key) >= 0,
						)
			if (!matched) continue

			result.set(dataKey, dataValue)
		}
	} else {
		const preRankedResults = [] as [number, K, V][]
		for (const [dataKey, dataValue] of data.entries()) {
			let matchIndex = -1
			if (qIsStr || qIsRegExp) {
				matchIndex = matchObjOrProp(options, dataValue, undefined)
				matchIndex >= 0
					&& preRankedResults.push([matchIndex, dataKey, dataValue])
				continue
			}

			const indexes: number[] = []
			const match = qKeys[matchAll ? 'every' : 'some'](
				// field-specific search
				key => {
					const index = matchObjOrProp(options, dataValue, key)
					indexes.push(index)
					return index >= 0
				},
			)
			if (!match) continue

			matchIndex = // eslint-disable-next-line @typescript-eslint/prefer-find
				indexes
					.sort((a, b) => a - b)
					// take the lowest index
					.filter(n => n !== -1)[0]

			matchIndex >= 0
				&& preRankedResults.push([matchIndex, dataKey, dataValue])
		}

		// Rank results by sorting them based on the match index. A lower index
		// signifies a match found earlier in the string, giving it a higher rank.
		preRankedResults
			.sort((a, b) => a[0] - b[0])
			.slice(0, limit)
			.forEach(([_, key, value]) => result.set(key, value))
	}

	return (asMap ? result : getValues(result)) as Result
}
search.defaultOptions = {
	asMap: true,
	ignoreCase: true,
	limit: Infinity,
	matchAll: false,
	ranked: false,
	transform: true,
} as Pick<
	// options that should always have default value
	Required<SearchOptions<unknown, unknown, false, true>>,
	'asMap' | 'ignoreCase' | 'limit' | 'matchAll' | 'ranked' | 'transform'
>

/**
 * Utility for use with {@link search} function
 *
 * @returns match index (`-1` means didn't match)
 */
export function matchObjOrProp<K, V>( // extends Record<string, unknown>
	{
		query,
		ignoreCase,
		matchExact,
		transform = true,
	}: Pick<
		SearchOptions<K, V, boolean>,
		'transform' | 'query' | 'ignoreCase' | 'matchExact'
	>,
	item: V,
	propertyName?: string,
): number {
	// Whether to search all properties
	const global = isStr(query) || isRegExp(query) || propertyName === undefined
	const keyword = global ? query : query[propertyName]
	const propVal: unknown =
		global || !isObj(item)
			? item
			: (item as Record<string, unknown>)[propertyName]
	const value = fallbackIfFails(
		() =>
			isFn(transform)
				? transform(
						item,
						global ? undefined : (propVal as V[keyof V]),
						propertyName as keyof V,
					)
				: matchExact && transform === false
					? propVal // Allow direct value/reference matching
					: isObj(propVal, false)
						? JSON.stringify(
								isArrLike(propVal)
									? [...propVal.values()]
									: Object.values(propVal),
							)
						: String((propVal as string) ?? ''),
		[],
		'',
	)
	// check if value matches as is
	if (value === keyword) return 0
	if (matchExact && !isRegExp(keyword)) return -1

	// Beyond this point only match values as string
	let valueStr = String(value)
	if (!valueStr.trim()) return -1
	if (isRegExp(keyword)) return valueStr.match(keyword)?.index ?? -1
	if (ignoreCase) valueStr = valueStr.toLowerCase()

	return valueStr.indexOf(String(keyword))
}

export default search
