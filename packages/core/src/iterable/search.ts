import fallbackIfFails from '../fallbackIfFails'
import { isArrLike, isEmpty, isFn, isMap, isObj, isRegExp, isStr } from '../is'
import { objCopy, objCreate } from '../obj'
import { mapValues } from '../map'
import getSize from './getSize'
import { IterableList, SearchOptions } from './types'

export const matchItemCb =
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
						: objToStr(propVal)
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

const objToStr = (propVal: unknown) =>
	JSON.stringify(isArrLike(propVal) ? [...propVal.values()] : propVal)

/**
 * @name	mapSearch
 * @summary search for objects by key-value pairs
 *
 * @param data				Map or Array of objects to search within
 * @param options			search criteria
 * @param search.query		(required) key-value pairs
 * @param search.ignoreCase (optional) case-insensitive search for strings
 * @param search.limit      (optional) limit number of results
 * @param search.matchAll   (optional) match all supplied key-value pairs
 * @param search.partial    (optional) partial match for values
 * @param search.result     (optional) Map to store results in
 *
 * @returns {Map} new map with matched items
 */
export const mapSearch = <
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

	options = objCopy(
		mapSearch.defaultOptions,
		options,
		[],
		'empty',
	) as Required<SearchOptions<K, V, AsMap>>
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
mapSearch.defaultOptions = {
	asMap: true,
	ignoreCase: true,
	limit: Infinity,
	matchAll: false,
	matchExact: false,
} as Required<SearchOptions<unknown, unknown, true>>

export default mapSearch
