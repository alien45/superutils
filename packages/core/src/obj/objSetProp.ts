import { isFn, isObj } from '../is'

export type SetObPropPredicate<K extends PropertyKey, V, OutKey> = (
	value: V | undefined,
	key: OutKey,
	obj: Record<K, V>,
) => boolean
/**
 * Conditionally assign value to an object's property
 *
 * @param obj target object
 * @param key object property name
 * @param falsyValue (optional) value to assign when condition is falsy Default: `obj[key]`
 * @param condition	(optional) condition to determine which value to provide. Default: `false`
 * @param truthyValue (optional) value to use if condition is truthy
 */
export const objSetProp = <K extends PropertyKey, V, OutKey extends K | string>(
	obj: Record<K, V>,
	key: OutKey,
	falsyValue?: V,
	condition?: boolean | SetObPropPredicate<K, V, OutKey>,
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
