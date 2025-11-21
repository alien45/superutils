import { isArr, isObj } from '../is'
import { RecordKey } from '../types'

/**
 * @function	objWithoutKeys
 * @summary constructs a new object excluding specific properties
 *
 * @param	{Object}	input
 * @param	{Array}		keys	property names to exclude
 * @param	{Object}	output	(optional) to delete unwanted props from the original `input` use it here.
 * 								Default: a copy of the `input` object
 *
 * @returns {Object}
 */
export const objWithoutKeys = (
	input: unknown,
	keys: string[],
	output?: Record<RecordKey, unknown>,
) => {
	if (!isObj(input, false)) return {}
	if (!isArr(keys) || !keys.length) return input

	output = {
		...(isObj(output, false) && output),
		...input,
	}
	for (const key of keys) delete output[key]
	return output
}
export default objWithoutKeys
