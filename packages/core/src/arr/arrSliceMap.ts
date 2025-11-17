import fallbackIfFails from '../fallbackIfFails'
import { isArr, isMap } from '../is'
import { mapValues } from '../map'

/**
 * @name	arrMapSlice
 * @summary slice an Array/Map and map the values
 *
 * @param {Array} 	 data
 * @param {Number}   start	(optional)
 * @param {Number}   end
 * @param {Function} callback   to be executed on each item within the set range
 *              				Params:
 *              				@currentValue
 *              				@currentIndex
 *              				@array
 *
 * @returns {Array} list of all items returned by @callback
 */
export const arrSliceMap = <
	T extends unknown[] | Map<unknown, unknown>,
	TValue = T extends Array<infer TA>
		? TA
		: T extends Map<unknown, infer TM>
			? TM
			: never,
	ReturnValue = TValue,
>(
	data: T,
	start = 0,
	end = 0,
	callback: (value: TValue, index: number, data: T) => ReturnValue,
	ignoreUndefined = true,
) => {
	const arr = (isMap(data) ? mapValues(data) : data) as TValue[]
	if (!isArr(data)) return []

	const len = data.length
	start = start >= 0 && start < len ? start : 0
	end = end >= start && end < len ? end : len - 1
	const result: ReturnValue[] = []
	for (var i = start; i <= end; i++) {
		const value = fallbackIfFails(
			callback,
			[arr[i], i, arr as T],
			undefined,
		)
		if (ignoreUndefined && value === undefined) continue

		result.push(value as ReturnValue)
	}
	return result
}
export default arrSliceMap
