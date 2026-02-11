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
 * @returns A `Promise` is returned if the `target` is a `Promise` or returns one.
 * Otherwise, the direct value is returned.
 *
 * @example
 * #### Async functions: working with async functions or functions that returns a promise
 *
 * ```typescript
 * import { fallbackIfFails } from '@superutils/core'
 *
 * const args = ['some value', true]
 * const ensureValue = async (value: string, criteria?: boolean) => {
 *     if (criteria !== false && !value.trim()) throw new Error('No value. Should use fallback value')
 *     return value
 * }
 * // This makes sure there's always a value without having to manually write try-catch block.
 * const value = await fallbackIfFails(
 *     ensureValue,
 *     () => args as Parameters<typeof ensureValue>,
 *     async () => 'fallback value'
 * )
 * console.log({ value }) // 'some value'
 * ```
 *
 * @example
 * #### Non-async functions: working synchronous function that returns value synchronously
 *
 * ```typescript
 * import { fallbackIfFails } from '@superutils/core'
 *
 * const args = ['some value', true]
 * const ensureValue = (value: string, criteria?: boolean) => {
 *     if (criteria !== false && !value.trim()) throw new Error('No value. Should use fallback value')
 *     return value
 * }
 * // this makes sure there's always a value without having to manually write try-catch block.
 * const value = fallbackIfFails(
 *     ensureValue,
 *     () => args as Parameters<typeof ensureValue>,
 *     () => 'fallback value'
 * )
 * console.log({ value }) // 'some value'
 * ```
 *
 * @example
 * #### Hybrid functions: working with function that returns value sync/async circumstantially
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
 * const first = await fallbackIfFails(getData, [false], { fallback: true })
 * console.log({ first }) // { fallback: true }
 *
 * // Second call: cache available and will return data synchronously
 * const second = fallbackIfFails(getData, [true], { fallback: true })
 * console.log({ second }) // { fallback: true }
 * ```
 *
 * @example
 * #### Fallback-chaining: gracefully handle the fallback function
 *
 * ```javascript
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
 *     () => fallbackIfFails(fallback, [], 'fallback')
 * )
 *
 * console.log({ value }) // 'fallback'
 * ```
 */
export const fallbackIfFails = <
	T,
	TArgs extends unknown[] = unknown[],
	TFB = T,
	TFBVal = TFB extends (...args: unknown[]) => infer V ? V : TFB,
	Result = (T extends Promise<unknown> ? true : never) extends never
		? T | TFBVal
		: Promise<Awaited<T | TFBVal>>,
>(
	target: T | ((...args: TArgs) => T),
	args: TArgs | (() => TArgs),
	fallback:
		| IfPromiseAddValue<TFB>
		| ((reason: unknown) => IfPromiseAddValue<TFB>),
): Result => {
	try {
		const result: unknown = !isFn(target)
			? target // assume value or promise received
			: target(...(isFn(args) ? args() : args))
		if (!isPromise(result)) return result as Result

		return result.catch((err: unknown) =>
			isFn(fallback) ? fallback(err) : fallback,
		) as Result
	} catch (err) {
		return (isFn(fallback) ? fallback(err) : fallback) as Result
	}
}
export default fallbackIfFails
