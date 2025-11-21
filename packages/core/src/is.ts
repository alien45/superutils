/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncFn } from './types'

export const isArr = <T = unknown>(x: any): x is T[] => Array.isArray(x)
/** Checks if argument is a 2-dimentional array */
export const isArr2D = <T = unknown>(x: any): x is T[][] =>
	isArr(x) && x.every(isArr)

/** Checks if value is convertible to an array by using `Array.from(x)` */
export const isArrLike = <T = unknown, TKey = unknown>(
	x: any,
): x is Set<T> | Map<unknown, T> | T[] =>
	isSet<T>(x) || isMap<TKey, T>(x) || isArr<T>(x)

/** Check if all values in the array are unique */
export const isArrUnique = <T = unknown>(arr: T[]): boolean =>
	Array.from(new Set<T>(arr)).length === arr.length

/**
 * @function isAsyncFn
 * Check if `x` is an Async function.
 * Caution: May not work at runtime when Babel/Webpack is used due to code compilation.
 *
 * ---
 * @example usage
 * ```typescript
 * isAsyncFn(async () => {}) // result: true
 * isAsyncFn(() => {}) // result: false
 * ```
 */
export const isAsyncFn = <TData = unknown, TArgs extends any[] = unknown[]>(
	x: any,
): x is AsyncFn<TData, TArgs> =>
	x instanceof (async () => {}).constructor
	&& (x as any)[Symbol.toStringTag] === 'AsyncFunction'

/** Check if value is boolean */
export const isBool = (x: any): x is boolean => typeof x === 'boolean'

/** Check if value is instance of Date */
export const isDate = (x: any): x is Date => x instanceof Date

/** Check if value is not undefined or null */
export const isDefined = <T = unknown>(x: T | undefined | null): x is T =>
	x !== undefined && x !== null

/**
 * Checks variable contains non-empty, non-null value.
 *
 * Depending on the type certain criteria applies:
 * - `String`: empty text or only white-spaces
 * - `Number`: non-finite or NaN
 * - `Array` / `Map` / `Set` / `Object`: contains zero items/properties
 *
 * @example Check strings
 * ```typescript
 * import { isEmpty } from '@superutils/core'
 * isEmpty('') // true
 * isEmpty(' ') // true
 * isEmpty(`
 *
 *
 * `) // true
 * isEmpty('    not empty   ') // false
 * isEmpty(`
 *
 *     not empty
 *
 * `) // false
 * ```
 *
 * @example check numbers
 * ```typescript
 * import { isEmpty } from '@superutils/core'
 * isEmpty(NaN) // true
 * isEmpty(Infinity) // true
 * isEmpty(0) // false
 * ```
 *
 *
 * @example check objects (includes arrays, maps & sets)
 * ```typescript
 * import { isEmpty } from '@superutils/core'
 * isEmpty({}) // true
 * isEmpty([]) // true
 * isEmpty(new Map()) // true
 * isEmpty(new Set()) // true
 * ```
 */
export const isEmpty = (x: any) => {
	if (!isDefined(x)) return true

	switch (Object.getPrototypeOf(x)) {
		case String.prototype:
			return !x.trim().length
		case Number.prototype:
			return !isValidNumber(x)
		case Array.prototype:
			return x.length === 0
		case Map.prototype:
		case Set.prototype:
			return x.size === 0
		case null: // when an object is created using `Object.create(null)`
		case Object.prototype:
			return Object.keys(x as object).length === 0
		case Boolean.prototype:
		default:
			return false // value is defined, therefore, is not empty
	}
}

/** Check if the environment is Browser */
export const isEnvBrowser = () =>
	typeof window !== 'undefined' && typeof window.document !== 'undefined'

/** Check if the environment is NodeJS */
export const isEnvNode = () =>
	typeof process !== 'undefined' && process?.versions?.node != null

/** Check if value is instance of Error */
export const isError = (x: any): x is Error => x instanceof Error

/** Check if value is a function */
export const isFn = (x: any): x is (...args: any[]) => any =>
	typeof x === 'function'

/** Check if value is an integer */
export const isInteger = (x: any): x is number => Number.isInteger(x)

/** Check if value is instance of Map */
export const isMap = <TKey = any, TValue = any>(
	x: any,
): x is Map<TKey, TValue> => x instanceof Map

/** Checks if value is not empty. See {@link isEmpty} for more details. */
export const isNotEmpty = (x: any) => !isEmpty(x)

/**
 * Checks if value is a valid object.
 *
 * @param x
 * @param strict (optional) whether to exclude anything other than plain object. Eg: Array, Map, RegExp, Set etc.
 * Default: `true`
 */
export const isObj = <T = object>(x: any, strict = true): x is T =>
	!!x // excludes null, NaN, Infinity....
	&& typeof x === 'object'
	&& (!strict
		// excludes Array, BigInt, Uint8Array, Map, Set...
		|| [
			Object.prototype,
			null, // when an object is created using `Object.create(null)`
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		].includes(Object.getPrototypeOf(x)))

/** Checks if value is a positive integer */
export const isPositiveInteger = (x: any): x is number => isInteger(x) && x > 0

/** Checks if value is a positive number */
export const isPositiveNumber = (x: any): x is number =>
	isValidNumber(x) && x > 0

/** Checks if value is a Promise */
export const isPromise = <T = any>(x: any): x is Promise<T> =>
	x instanceof Promise

/** Checks if value is a regular expession */
export const isRegExp = (x: any): x is RegExp => x instanceof RegExp

/** Checks if value is instance of Set */
export const isSet = <T = any>(x: any): x is Set<T> => x instanceof Set

/** Checks if value is string */
export const isStr = (x: any): x is string => typeof x === 'string'

/**
 * Checks if value is similar to a RxJS subject with .subscribe & .next functions
 *
 * @param x The value to check
 * @param withValue When `true`, also checks if `value` property exists in `x`
 *
 * @returns `true` if the value is subject-like, `false` otherwise.
 */
export const isSubjectLike = (x: unknown, withValue = false) =>
	isObj<{ subscribe: any; next: any }>(x, false)
	&& isFn(x.subscribe)
	&& isFn(x.next)
	&& (!withValue || 'value' in x)

/** Check if value is a Symbol */
export const isSymbol = (x: any): x is symbol => typeof x === 'symbol'

/** Check if page is loaded on a touchscreen device */
export const isTouchable = () => {
	try {
		return 'ontouchstart' in window.document.documentElement
	} catch (_) {
		return false
	}
}

/** Check if value is instance of Uint8Array */
export const isUint8Arr = (arr: any) => arr instanceof Uint8Array

/** Checks if value is instance of URL */
export const isUrl = (x: any): x is URL => x instanceof URL

/**
 * @function    isValidDate
 * @summary Checks if a value is a valid date.
 *
 * @param   date The value to check. Can be a Date object or a string.
 *
 * @returns `true` if the value is a valid date, `false` otherwise.
 */
export const isValidDate = (date: any) => {
	const dateIsStr = isStr(date)
	if (!dateIsStr && !isDate(date)) return false

	const dateObj = new Date(date)
	// avoids 'Invalid Date'
	if (Number.isNaN(dateObj.getTime())) return false
	// provided dateOrStr is a Date object and has a valid timestamp
	if (!dateIsStr) return true

	// Hack to catch `new Date(dateOrStr)` side-effects. Eg: converting '2021-02-31' to '2021-03-03'
	const [original, converted] = [date, dateObj.toISOString()].map(y =>
		y.replace(/[TZ]/g, '').substring(0, 10),
	)
	return original === converted
}

/** Checks if value is a valid finite number */
export const isValidNumber = (x: any): x is number =>
	typeof x == 'number' && !isNaN(x) && isFinite(x)

/**
 * Checks if a value is a valid URL.
 * @param x The value to check.
 * @param strict If true:
 * - requires a domain name with a TLDs etc.
 * - and x is string, catches any auto-correction (eg: trailing spaces being removed, spaces being replaced by `%20`)
 * by `new URL()` to ensure string URL is valid
 * Defaults to `true`.
 * @param tldExceptions when in strict mode, treat these hosts as valid despite no domain name extensions
 * Defaults to `['localhost']`
 *
 * @returns `true` if the value is a valid URL, `false` otherwise.
 */
export const isValidURL = (
	x: any,
	strict = true,
	tldExceptions = ['localhost'],
) => {
	if (!x) return false
	try {
		const isAnUrl = isUrl(x)
		const isAStr = isStr(x)
		if (!isAStr && !isAnUrl) return false
		const url = isAnUrl ? (x as URL) : new URL(x as string)
		// If strict mode is set to `true` and if a string value provided, it must match resulting value of new URL(x).
		// This can be used to ensure that a URL can be queried without altering.
		if (!strict) return true

		// require domain name & extension when not using localhost
		const gotTld =
			tldExceptions.includes(url.hostname)
			|| url.host.split('.').length > 1
		if (!gotTld) return false

		// catch any auto-correction by `new URL()` to ensure string URL is valid
		// Eg: spaces in the domain name being replaced by `%20` or missing `/` in protocol being auto added
		// Eg: trailing and leading spaces being removed
		x = `${x}`
		if (x.endsWith(url.hostname)) x += '/'
		return url.href == x
	} catch (_) {
		return false
	}
}

/**
 * Combination of all the compile-time & runtime utilities functions above
 */
export const is = {
	arr: isArr,
	arr2D: isArr2D,
	arrLike: isArrLike,
	arrUnique: isArrUnique,
	asyncFn: isAsyncFn,
	bool: isBool,
	date: isDate,
	defined: isDefined,
	empty: isEmpty,
	envBrowser: isEnvBrowser,
	envNode: isEnvNode,
	error: isError,
	fn: isFn,
	integer: isInteger,
	map: isMap,
	notEmpty: isNotEmpty,
	obj: isObj,
	positiveInteger: isPositiveInteger,
	positiveNumber: isPositiveNumber,
	promise: isPromise,
	regexp: isRegExp,
	set: isSet,
	str: isStr,
	url: isUrl,
	validDate: isValidDate,
	validNumber: isValidNumber,
	validURL: isValidURL,
}
export default is
