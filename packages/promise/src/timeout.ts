import { isFn, isObj, isPositiveNumber } from '@superutils/core'
import delayReject from './delayReject'
import PromisEBase from './PromisEBase'
import { IPromisE_Timeout } from './types'
import { TimeoutFunc, type TimeoutOptions } from './types'

/**
 * @function    PromisE.timeout
 * @summary times out a promise after specified timeout duration.
 *
 * @param   timeout (optional) timeout duration in milliseconds.
 *                  Default: `10000` (10 seconds)
 * @param   values  promise/function: one or more promises as individual arguments
 *
 * @example Example 1: single promise - resolved
 * ```typescript
 * PromisE.timeout(
 *   5000, // timeout after 5000ms
 *   PromisE.delay(1000), // resolves after 1000ms with value 1000
 * ).then(console.log)
 * // Result: 1000
 * ```
 *
 * @example Example 2: multiple promises - resolved
 *
 * ```typescript
 * PromisE.timeout(
 *     5000, // timeout after 5000ms
 *     PromisE.delay(1000), // resolves after 1000ms with value 1000
 *     PromisE.delay(2000), // resolves after 2000ms with value 2000
 *     PromisE.delay(3000), // resolves after 3000ms with value 3000
 * ).then(console.log)
 * // Result: [ 1000, 2000, 3000 ]
 * ```
 *
 * @example Example 3: timed out & rejected
 * ```typescript
 * PromisE.timeout(
 *     5000, // timeout after 5000ms
 *     PromisE.delay(20000), // resolves after 20000ms with value 20000
 * ).catch(console.error)
 * // Error: Error('Timed out after 5000ms')
 *```
 *
 * @example Example 4: timed out & but not rejected.
 * // Eg: when API request is taking longer than expected, print a message but not reject the promise.
 * ```typescript
 * const promise = PromisE.timeout(
 *     5000, // timeout after 5000ms
 *     PromisE.delay(20000), // data promise, resolves after 20000ms with value 20000
 * )
 * const data = await promise.catch(err => {
 *     // promise did not time out, but was rejected because one of the data promises rejected
 *     if (!promise.timedout) return Promise.reject(err)
 *
 *     // promise timed out >> print/update UI
 *     console.log('Request is taking longer than expected......')
 *     // now return the data promise (the promise(s) provided in the PromisE.timeout())
 *     return promise.data
 * })
 *```
 */
export function timeout<
	T extends [unknown, ...unknown[]], // require at least one value
	TFunc extends keyof TimeoutFunc<T>,
	Result = T['length'] extends 1
		? Awaited<T[0]>
		: Awaited<ReturnType<TimeoutFunc<T>[TFunc]>>,
>(
	timeout: number | TimeoutOptions<TFunc>,
	...values: T
): IPromisE_Timeout<Result> {
	let funcName = 'all' as TFunc
	let timeoutMsg = ''
	if (isObj(timeout)) {
		funcName = timeout.func
		timeoutMsg = timeout.timeoutMsg ?? ''
		timeout = timeout.timeout ?? 10_000
	}
	timeout = (isPositiveNumber(timeout) && timeout) || 10_000

	const func = isFn(PromisEBase[funcName])
		? PromisEBase[funcName]
		: PromisEBase.all
	const dataPromise = (
		values.length <= 1
			? new PromisEBase<T[0]>(values?.[0]) // single promise resolves to a single result
			: func(values)
	) as PromisEBase<Result> // array of promises resolves to an array of results
	const timeoutPromise = delayReject<Result>(
		timeout,
		new Error(timeoutMsg || `Timed out after ${timeout}ms`),
	)
	const promise = PromisEBase.race([
		dataPromise,
		timeoutPromise,
	]) as IPromisE_Timeout<Result>
	promise.clearTimeout = () => clearTimeout(timeoutPromise.timeoutId)
	promise.data = dataPromise
	promise.timeout = timeoutPromise
	// add a short hand `promise.timedout` to access whether promise has timed out
	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	Object.defineProperty(promise, 'timedout', {
		get: () => promise.timeout.rejected,
	})
	// clear timeout after finalization
	dataPromise
		.catch(() => {
			/* avoid unhandled rejections here */
		})
		.finally(() => {
			promise.clearTimeout()
		})

	return promise
}
timeout.defaultOptions = {
	func: 'all',
	timeout: 10_000,
} as Required<TimeoutOptions>
export default timeout
