import { IterableList } from '../iterable'
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
export const isArr2D = <T = unknown>(x: unknown): x is T[][] =>
	isArr(x) && x.every(isArr)

/** Check if value is convertible to an array by using `Array.from(x)` */
export const isArrLike = <K = unknown, V = unknown>(
	x: unknown,
): x is IterableList<K, V> => isArr(x) || x instanceof Set || x instanceof Map

/**
 * Check if value is convertible to an array by using `Array.from(x)` even if it comes from a different realm
 * (eg: iframe, iframes, worker contexts, node vm contexts, browser extensions).
 *
 * Caution: much slower than {@link isArrLike} due to use of `Object.prototype.toString.call()`
 */
export const isArrLikeSafe = <K = unknown, V = unknown>(
	x: unknown,
): x is IterableList<K, V> =>
	['[object Array]', '[object Map]', '[object Set]'].includes(
		Object.prototype.toString.call(x),
	)

/** Check if all values in the array are unique */
export const isArrUnique = <T = unknown>(x: unknown): x is T[] =>
	isArr(x) && new Set(x).size === x.length

/** Check if value is instance of Uint8Array */
export const isUint8Arr = (x: unknown): x is Uint8Array =>
	x instanceof Uint8Array

export default isArr
