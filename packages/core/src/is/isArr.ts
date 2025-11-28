import { isObj } from './isObj'

/** Check if value is an array */
export const isArr = <Item = unknown>(x: unknown): x is Item[] =>
	Array.isArray(x)

/**
 * Check if value is an array of objects
 */
export const isArrObj = <K extends PropertyKey, V, T extends Record<K, V>[]>(
	x: unknown,
	strict = true,
): x is T[] => isArr<T>(x) && x.every(x => isObj(x, strict))

/** Check if argument is a 2-dimentional array */
export const isArr2D = <Item = unknown>(x: unknown): x is Item[][] =>
	isArr(x) && x.every(isArr)

/** Check if value is convertible to an array by using `Array.from(x)` */
export const isArrLike = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	x: any,
): x is typeof x extends (infer Value)[]
	? Value[]
	: typeof x extends Set<infer Value>
		? Set<Value>
		: typeof x extends Map<infer Key, infer Value>
			? Map<Key, Value>
			: never => isArr(x) || x instanceof Set || x instanceof Map

/**
 * Check if value is convertible to an array by using `Array.from(x)` even if it comes from a different realm
 * (eg: iframe, iframes, worker contexts, node vm contexts, browser extensions).
 *
 * Caution: much slower than {@link isArrLike()} due to use of `Object.prototype.toString.call()`
 */
export const isArrLikeSafe = <T = unknown, MapKey = unknown>(
	x: unknown,
): x is Set<T> | Map<MapKey, T> | T[] =>
	['[object Array]', '[object Map]', '[object Set]'].includes(
		Object.prototype.toString.call(x),
	)

/** Check if all values in the array are unique */
export const isArrUnique = <T = unknown>(arr: T[]): boolean =>
	isArr(arr) && new Set<T>(arr).size === arr.length

/** Check if value is instance of Uint8Array */
export const isUint8Arr = (arr: unknown) => arr instanceof Uint8Array

export default isArr
