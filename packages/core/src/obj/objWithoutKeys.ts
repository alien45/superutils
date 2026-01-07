import { isArr, isObj } from '../is'

/**
 * Creates a new object excluding specific properties
 *
 * @param	{Object}	input
 * @param	{Array}		keys	property names to exclude
 * @param	{Object}	output	(optional) to delete unwanted props from the original `input` use it here.
 * 								Default: a copy of the `input` object
 *
 * @returns {Object}
 *
 * @example Create a new object excluding specific properties
 *
 * ```javascript
 * import { objWithoutKeys } from '@superutils/core'
 *
 * const result = objWithoutKeys({ a: 1, b: '2', c: false }, ['b', 'c'])
 * console.log(result) // { a: 1 }
 * ```
 *
 * @example Copy one object's properties to another while ignoring specific properties
 *
 * ```javascript
 * import { objWithoutKeys } from '@superutils/core'
 *
 * const source = { a: 1, b: '2', c: false }
 * const dest = { d: 4, e: 5 }
 * const result = objWithoutKeys(source, ['b', 'c'], dest)
 * console.log(result) // { d: 4, e: 5, a: 1 }
 * console.log(result === dest) // true
 * ```
 */
export const objWithoutKeys = (
	input: unknown,
	keys: string[],
	output?: Record<PropertyKey, unknown>,
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
