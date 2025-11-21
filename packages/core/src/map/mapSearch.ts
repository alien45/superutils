import { isArr, isMap, isObj, isRegExp, isSet, isStr } from '../is'
import mapEntries from './mapEntries'
import { mapValues } from './mapValues'
import { SearchConfig } from './types'

/**
 * @name	mapSearch
 * @summary search for objects by key-value pairs
 *
 * @param 	{Map|Object[]}		map		  Map or Array of objects to search within
 * @param 	{Object}	search			  search criteria
 * @param 	{Object}	search.query	  key-value pairs
 * @param 	{Boolean}	search.ignoreCase (optional) case-insensitive search for strings
 * @param 	{Number}	search.limit      (optional) limit number of results
 * @param 	{Map}		search.result     (optional) Map to store results in
 * @param 	{Boolean}	search.partial    (optional) partial match for values
 * @param 	{Boolean}	search.matchAll   (optional) match all supplied key-value pairs
 *
 * @returns {Map} new map with matched items
 */
export const mapSearch = <
	K,
	V extends Record<string, unknown>,
	T extends Map<K, V> | V[],
	AsMap extends boolean = true,
	Result = AsMap extends true ? Map<K, V> : V[],
>(
	map: T,
	conf: SearchConfig<K, V, AsMap>,
): Result => {
	conf = (isObj(conf) && conf) || {}
	const {
		asMap = true as AsMap,
		ignoreCase = true,
		limit = Infinity,
		matchAll = false,
		matchExact = false,
	} = conf
	let { query, result } = conf
	if (!isObj(query)) query = {}
	if (!isMap(result)) result = new Map<K, V>()
	const qKeys = Object.keys(query)
	const entries = (
		qKeys.length === 0
			? []
			: isMap(map)
				? mapEntries(map)
				: isArr(map)
					? map.map((x, i) => [i, x])
					: []
	) as [K, V][]

	if (!qKeys.length || !entries.length)
		return (asMap ? result : mapValues(result)) as Result

	// Pre-process keywords for case-insensitivity outside the main loop
	if (ignoreCase) {
		query = { ...query }
		for (const key of qKeys) {
			if (!isStr(query[key])) continue
			query[key] = query[key].toLowerCase()
		}
	}

	const check = (item: V, key: string): boolean => {
		if (!isObj(item)) return false

		const keyword = query[key]
		const kv = item[key] ?? ''
		let value = isObj(kv, false)
			? JSON.stringify(
					isMap(kv) ? mapValues(kv) : isSet(kv) ? [...kv] : kv,
				)
			: `${(kv as string) ?? ''}`

		if (ignoreCase) value = value.toLowerCase()
		if (isRegExp(keyword)) return keyword.test(`${value}`)
		if (value === keyword) return true

		return !matchExact && `${value}`.includes(keyword as string)
	}

	for (const [itemKey, item] of entries) {
		if (result.size >= limit) break

		if (!qKeys[matchAll ? 'every' : 'some'](k => check(item, k))) continue

		result.set(itemKey, item)
	}
	return (asMap ? result : mapValues(result)) as Result
}

export default mapSearch
