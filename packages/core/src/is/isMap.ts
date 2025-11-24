import isObj from './isObj'

/** Check if value is instance of Map */
export const isMap = <TKey = unknown, TValue = unknown>(
	x: unknown,
): x is Map<TKey, TValue> => x instanceof Map

/** Check if provided is a Map and all values are objects */
export const isMapObj = <K extends PropertyKey, V, T extends Record<K, V>>(
	x: unknown,
	strict = true,
): x is Map<K, V> =>
	isMap(x) && [...x.values()].every(value => isObj<T>(value as T, strict))

export default isMap
