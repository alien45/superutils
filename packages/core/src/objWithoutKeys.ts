import { isArr, isObj } from './is'

type Key = keyof any
/**
 * @name	objWithoutKeys
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
	output?: Record<Key, unknown>,
) => {
	if (!isObj(input, false)) return {}
	if (!isArr(keys) || !keys.length) return input

	output = {
		...(isObj(output, false) && output),
		...input,
	}
	for (let i = 0; i < keys.length; i++) {
		delete output[keys[i]]
	}
	return output
}
export default objWithoutKeys
