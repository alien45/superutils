import { isFn, isPromise } from './is'

/**
 * If `T` is a promise turn it into an union type by adding the value type
 */
export type IfPromiseAddValue<T> = T extends Promise<infer V> ? T | V : T

/**
 * @function fallbackIfFails
 * @summary a flexible try-catch wrapper for invoking functions and ignore errors gracefully.
 * Yes, the goal of `fallbackIfFails` is to ignore all runtime errors
 * and ensure there's always a value returned.
 *
 * ---
 *
 * `fallbackValue` PS:
 *
 * 1. If function provided and Error is thrown it will not be caught.
 * A fallback of the fallback is out of the scope of this function.
 * 2. If `target` a promise or async function, `fallbackValue` must either be a promise or resolve to a promise
 *
 * ---
 *
 * @param target        promise or function to execute
 * @param args			arguments to be supplied to `func` fuction
 * @param fallbackValue alternative value to be used when target throws error.
 *
 * @returns if func is a promise the return a promise
 *
 * Examples:
 * ---
 * @example Async functions
 * Working with async functions or functions that returns a promise
 * ```typescript
 * const args = ['some value', true] as const
 * const ensureValue = async (value: string, criteria?: boolean) => {
 *     if (criteria !== false && !value.trim()) throw new Error('No value. Should use fallback value')
 *     return value
 * }
 * // This makes sure there's always a value without having to manually write try-catch block.
 * const value = await fallbackIfFails(
 *     ensureValue,
 *     () => args,
 *     async () => 'fallback value'
 * )
 * ```
 *
 * @example Non-async functions
 * Working synchronous function that returns value synchronously
 * ```typescript
 * const args = ['some value', true] as const
 * const ensureValue = (value: string, criteria?: boolean) => {
 *     if (criteria !== false && !value.trim()) throw new Error('No value. Should use fallback value')
 *     return value
 * }
 * // this makes sure there's always a value without having to manually write try-catch block.
 * const value = fallbackIfFails(
 *     ensureValue,
 *     () => args,
 *     () => 'fallback value'
 * )
 * ```
 *
 * @example Hybrid functions
 * Working with function that returns value sync/async circumstantially
 * ```typescript
 * const getData = (useCache = true, cacheKey = 'data-cache') => {
 *     if (useCache && localStorage[cacheKey]) return localStorage[cacheKey]
 *     return fetch('https://my.domain.com/api')
 *         .then(r => r.json())
 *         .then(data => {
 * 		       if(cacheKey) localStorage[cacheKey] = data
 *             return data
 *         })
 * }
 * // First call: no cache, will execute fetch and return a promise
 * const first = await fallbackIfFails(getData, [false], {})
 * // Second call: cache available and will return data synchronously
 * const second = fallbackIfFails(getData, [true], {})
 * ```
 */
export const fallbackIfFails = <T, TArgs extends unknown[] = unknown[]>(
	target: T | ((...args: TArgs) => T),
	args: TArgs | (() => TArgs),
	fallbackValue:
		| IfPromiseAddValue<T>
		| ((reason: unknown) => IfPromiseAddValue<T>),
): T => {
	let result: unknown
	try {
		result = !isFn(target)
			? target // assume value or promise received
			: target(...(isFn(args) ? args() : args))
		if (!isPromise(result)) return result as T

		result = result.catch(getAltValCb(fallbackValue))
	} catch (error) {
		result = getAltValCb(fallbackValue)(error)
	}
	return result as T
}
export default fallbackIfFails

const getAltValCb =
	<T>(fallbackValue: T | ((error: unknown) => T)) =>
	(error: unknown) =>
		isFn(fallbackValue) ? fallbackValue(error) : fallbackValue
