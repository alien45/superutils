import { isFn, isObj } from '../is'

/**
 * Assign value to an object property
 *
 * @param obj
 * @param key
 * @param falsyValue (optional) Default: `obj[key]`
 * @param condition	(optional)
 * @param truthyValue (optional) value to use if condition is truthy
 */
export const objSetProp = <K extends PropertyKey, V, OutKey extends K | string>(
	obj: Record<K, V>,
	key: OutKey,
	falsyValue?: V,
	condition?:
		| boolean
		| ((value: V | undefined, key: OutKey, obj: Record<K, V>) => boolean),
	truthyValue?: V,
) => {
	const result = (!isObj(obj, false) ? {} : obj) as Record<OutKey, V>

	falsyValue ??= result[key]
	condition = isFn(condition)
		? condition(result[key] ?? falsyValue, key, obj)
		: condition
	result[key] = !condition ? falsyValue : (truthyValue as V)
	return result
}

/** Assign value to an object property only if current value is undefined */
export const objSetPropUndefined = (
	...[obj, key, ...args]: Parameters<typeof objSetProp>
) => (obj?.[key] === undefined && objSetProp(obj, key, ...args)) || obj
