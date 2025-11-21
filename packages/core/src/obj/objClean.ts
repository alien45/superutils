import { arrUnique } from '../arr'
import { isArr, isObj, isStr, isSymbol } from '../is'
import { RecordKey } from '../types'

/**
 * @name	objClean
 * @summary	constructs a new object with only the supplied property names (keys) and their respective values
 *
 * @param obj
 * @param keys property names to keep
 * @param recursive (optional) Default: `false`
 * @param ignoreIfNotExist (optional) if truthy, will ignore non-existent `keys`. Default: `true`
 */
export const objClean = <
	T extends Record<RecordKey, unknown>,
	Key extends keyof T = keyof T,
>(
	obj: T,
	keys: Key[],
	ignoreIfNotExist = true,
) => {
	const result = {} as Record<Key, T[Key]>
	if (!isObj(obj) || !isArr(keys)) return result

	const uniqKeys = arrUnique(
		keys.map(x => (isStr(x) ? `${x}`.split('.')[0] : x)),
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
			value as Record<RecordKey, unknown>,
			childKeys,
		) as T[Key]
	}
	return result
}
