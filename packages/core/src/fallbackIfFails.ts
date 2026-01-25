import { isFn, isPromise } from './is'
import { IfPromiseAddValue } from './types'

/**
 * @function fallbackIfFails
 * @summary a flexible try-catch wrapper for invoking functions and ignore errors gracefully.
 * Yes, the goal of `fallbackIfFails` is to ignore all runtime errors
 * and ensure there's always a value returned.
 *
 * @param target promise or function to execute
 * @param args arguments to be supplied to `func` fuction
 * @param fallback alternative value to be used when target throws error.
 *
 * - If `fallback` is a function and it raises exception, it will cause to raise an exception instead of gracefully
 * ignoring it. A fallback of the fallback function is out of the scope of `fallbackIfFails`. However, the fallback
 * function can still be wrapped inside a secondary `fallbackIfFails`. See the "Fallback chaining" example below.
 * - If `target` a promise or async function, `fallback` can be either be  a value, a promise or an async function.
 *
 * @returns if func is a promise the return a promise
 *
 * Examples:
 * ---
 * @example Async functions
 * Working with async functions or functions that returns a promise
 *
 * ```typescript
 * import { fallbackIfFails } from '@superutils/core'
 *
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
 *
 * ```typescript
 * import { fallbackIfFails } from '@superutils/core'
 *
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
 *
 * ```typescript
 * import { fallbackIfFails } from '@superutils/core'
 *
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
 *
 * @example Fallback-chaining: gracefully handle the fallback function
 *
 * ```typescript
 * import { fallbackIfFails } from '@superutils/core'
 *
 * const target = () => {
 *     if (new Date().getTime() > 0) throw new Error('I will raise error')
 * }
 * const fallback = () => {
 *     throw new Error('I will also raise an exception')
 * }
 * const value = fallbackIfFails(
 *     target,
 *     [],
 * 	   // this function will only be invoked when
 *     () => fallbackIfFails(fallback, [], undefined)
 * )
 *
 * console.log({ value }) // undefined
 * ```
 */
export const fallbackIfFails = <T, TArgs extends unknown[] = unknown[]>(
	target: T | ((...args: TArgs) => T),
	args: TArgs | (() => TArgs),
	fallback:
		| IfPromiseAddValue<T>
		| ((reason: unknown) => IfPromiseAddValue<T>),
): T => {
	try {
		const result: unknown = !isFn(target)
			? target // assume value or promise received
			: target(...(isFn(args) ? args() : args))
		if (!isPromise(result)) return result as T

		return result.catch(err =>
			isFn(fallback) ? fallback(err) : fallback,
		) as T
	} catch (err) {
		return (isFn(fallback) ? fallback(err) : fallback) as T
	}
}
export default fallbackIfFails
