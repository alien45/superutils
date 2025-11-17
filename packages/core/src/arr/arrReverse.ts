import { isArr } from '../is'

/**
 * @name	arrReverse
 * @summary Reverse an array conditionally
 *
 * @param   arr
 * @param	reverse	 (optional) condition to reverse the array.
 * 								 Default: true
 * @param	newArray (optional) whether to cnstruct new array or use input.
 * 								 Default: true
 *
 */
export const arrReverse = <T = unknown>(
	arr: T[],
	reverse = true,
	newArray = true,
) => {
	if (!isArr(arr)) return []
	if (newArray) arr = [...arr]
	return reverse ? arr.reverse() : arr
}

export default arrReverse
