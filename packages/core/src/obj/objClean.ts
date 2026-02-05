import { arrUnique } from '../arr'
import { isArr, isObj, isSymbol } from '../is'

/**
 * Constructs a new object with only the supplied property names (keys) and their respective values
 *
 * @param obj
 * @param keys property names to keep
 * @param ignoreIfNotExist (optional) if truthy, will ignore non-existent `keys`. Default: `true`
 *
 * @example
 * ```javascript
 * import { objClean } from '@superutils/core'
 *
 * const obj = {
 * 	a: 1,
 * 	b: 2,
 * 	c: 3,
 * 	d: 4
 * }
 * console.log(objClean(obj, [ 'a', 'b']))
 * // { a: 1, b: 2 }
 * ```
 */
export const objClean = <
	T extends Record<PropertyKey, unknown>,
	Key extends keyof T = keyof T,
>(
	obj: T,
	keys: Key[],
	ignoreIfNotExist = true,
) => {
	const result = {} as Record<Key, T[Key]>
	if (!isObj(obj) || !isArr(keys)) return result

	const uniqKeys = arrUnique(
		keys.map(x => String(x).split('.')[0]),
	).sort() as Key[]

	for (const key of uniqKeys) {
		if (ignoreIfNotExist && !obj.hasOwnProperty(key)) continue

		const value = obj[key]
		// recursively clean up child property with object value
		if (!isObj(value) || isSymbol(key)) {
			result[key] = value
			continue
		}

		const childPrefix = `${key as string}.`
		const childKeys = (keys as string[])
			.filter(k => k?.startsWith?.(childPrefix))
			// get rid of child key prefix
			.map(k => k.split(childPrefix)[1])
		if (!childKeys.length) {
			// no specific child properties provided >> include entire object
			result[key] = value as T[Key]
			continue
		}

		result[key] = objClean(
			value as Record<PropertyKey, unknown>,
			childKeys,
		) as T[Key]
	}
	return result
}
