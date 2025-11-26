import isArr, {
	isArr2D,
	isArrLike,
	isArrLikeSafe,
	isArrObj,
	isArrUnique,
	isUint8Arr,
} from './isArr'
import isDate, { isDateValid } from './isDate'
import isEmpty, { isEmptySafe } from './isEmpty'
import { isEnvBrowser, isEnvNode, isEnvTouchable } from './isEnv'
import isFn, { isAsyncFn } from './isFn'
import { isMap, isMapObj } from './isMap'
import {
	isInteger,
	isPositiveInteger,
	isPositiveNumber,
	isNumber,
} from './isNumber'
import isObj from './isObj'
import isUrl, { isUrlValid } from './isUrl'

export * from './isArr'
export * from './isDate'
export * from './isEmpty'
export * from './isEnv'
export * from './isFn'
export * from './isMap'
export * from './isNumber'
export * from './isObj'
export * from './isUrl'

/** Check if value is boolean */
export const isBool = (x: unknown): x is boolean =>
	typeof x === 'boolean' || x instanceof Boolean

/** Check if value is not undefined or null */
export const isDefined = <T = unknown>(x: T | undefined | null): x is T =>
	x !== undefined && x !== null

/** Check if value is instance of Error */
export const isError = (x: unknown): x is Error => x instanceof Error

/** Check if value is a Promise */
export const isPromise = <T = unknown>(x: unknown): x is Promise<T> =>
	x instanceof Promise

/** Check if value is a regular expession */
export const isRegExp = (x: unknown): x is RegExp => x instanceof RegExp

/** Check if value is instance of Set */
export const isSet = <T = unknown>(x: unknown): x is Set<T> => x instanceof Set

/** Check if value is string */
export const isStr = (x: unknown): x is string => typeof x === 'string'

/**
 * Check if value is similar to a RxJS subject with .subscribe & .next functions
 *
 * @param x The value to check
 * @param withValue When `true`, also checks if `value` property exists in `x`
 *
 * @returns `true` if the value is subject-like, `false` otherwise.
 */
export const isSubjectLike = (x: unknown, withValue = false) =>
	isObj<{ subscribe: unknown; next: unknown }>(x, false)
	&& isFn(x.subscribe)
	&& isFn(x.next)
	&& (!withValue || 'value' in x)

/** Check if value is a Symbol */
export const isSymbol = (x: unknown): x is symbol => typeof x === 'symbol'

/**
 * Compilation of all the compile-time & runtime utilities functions above
 */
export const is = {
	arr: isArr,
	arr2D: isArr2D,
	arrLike: isArrLike,
	arrLikeSafe: isArrLikeSafe,
	arrObj: isArrObj,
	arrUnique: isArrUnique,
	asyncFn: isAsyncFn,
	bool: isBool,
	date: isDate,
	dateValid: isDateValid,
	defined: isDefined,
	empty: isEmpty,
	emptySafe: isEmptySafe,
	envBrowser: isEnvBrowser,
	envNode: isEnvNode,
	envTouchable: isEnvTouchable,
	error: isError,
	fn: isFn,
	integer: isInteger,
	map: isMap,
	mapObj: isMapObj,
	number: isNumber,
	obj: isObj,
	positiveInteger: isPositiveInteger,
	positiveNumber: isPositiveNumber,
	promise: isPromise,
	regExp: isRegExp,
	set: isSet,
	str: isStr,
	subjectLike: isSubjectLike,
	symbol: isSymbol,
	uint8Arr: isUint8Arr,
	url: isUrl,
	urlValid: isUrlValid,
}
export default is
