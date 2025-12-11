import { isArr, isFn, isMap, isSet } from '../is'
import { IterableList } from './types'

/**
 * Reverse a {@link IterableList} (Array/Map/Set) conditionally
 *
 * @param   data
 * @param	reverse	 (optional) condition to reverse the list. Default: `true`
 * @param	newInstance (optional) whether to return a new instance of the list. Default: `false`
 *
 * @returns reversed data in original type or empty array for unsupported type
 */
export const reverse = <K, V, T extends IterableList<K, V>>(
	data: T,
	reverse = true,
	newInstance = false,
) => {
	const dataType = isArr(data) ? 1 : isMap(data) ? 2 : isSet(data) ? 3 : 0
	if (!dataType) return []

	const arr = (
		dataType === 1
			? !newInstance
				? data
				: [...(data as V[])]
			: dataType === 2
				? [...data.entries()]
				: [...data.values()]
	) as V[] | [K, V][]

	if (reverse) arr.reverse()

	switch (dataType) {
		case 1:
			return arr
		case 2:
		case 3:
			if (newInstance || !('clear' in data && isFn(data.clear)))
				return dataType === 2
					? new Map(arr as [K, V][]) // craete map with entries
					: new Set(arr as V[])
	}

	data?.clear?.()
	for (const item of arr)
		'set' in data
			? (data as Map<K, V>).set?.(...(item as [K, V]))
			: 'add' in data && (data as Set<V>)?.add?.(item as V)

	return data
}

export default reverse
