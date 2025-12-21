import { isArr, isEmpty, isObj } from '../is'

/**
 * Checks if all the supplied keys exist in an object
 *
 * @param input
 * @param keys
 * @param requireValue (optional) whether each property should have some value.
 */
export function objHasKeys(
	input: object | unknown[] = {},
	keys: PropertyKey[] = [],
	requireValue = false,
) {
	if (!isObj(input) || !isArr(keys)) return false

	for (const key of keys) {
		if (!input.hasOwnProperty(key)) return false
		if (requireValue && isEmpty(input[key])) return false
	}
	return true
}
export default objHasKeys
