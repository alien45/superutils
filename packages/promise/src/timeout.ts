import { isFn, isObj, isPositiveNumber } from '@superutils/core'
import delayReject from './delayReject'
import PromisEBase from './PromisEBase'
import { IPromisE_Timeout } from './types'
import { TimeoutFunc, type TimeoutOptions } from './types'

/**
 * Creates a new promise that wraps one or more promises and rejects if they do not settle within a
 * specified timeout duration. When multiple promises are provided, they can be processed using methods like
 *  `all` (default), `race`, `any`, or `allSettled`.
 *
 * @param timeout (optional) timeout duration in milliseconds.
 * Default: `10000` (10 seconds)
 *
 * @param values rest param containing one or more promises/values
 *
 * @example Wokring with a single promise: resolved succesfully
 * ```typescript
 * PromisE.timeout(
 *   5000, // timeout after 5000ms
 *   PromisE.delay(1000), // resolves after 1000ms with value 1000
 * ).then(console.log)
 * // Result: 1000
 * ```
 *
 * @example Promise times out & rejected
 * ```typescript
 * PromisE.timeout(
 *     5000, // timeout after 5000ms
 *     PromisE.delay(20000), // resolves after 20000ms with value 20000
 * ).catch(console.error)
 * // Error: Error('Timed out after 5000ms')
 *```
 *
 * @example Working with multiple promises, resolved using "PromisE.all()"
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
 * @example Promise times out & but not rejected.
 * Eg: when API request is taking longer than expected, print a message avoid rejecting the promise.
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
 *     // Now return the data promise which is the result of `PromisE.all(promises)` (default).
 *     return promise.data
 * })
 *```
 *
 * @example Multiple promises resolved using "PromisE.race()"
 *
 * ```typescript
 * PromisE.timeout(
 *     { // instead of `timeout: number` an object can be used for additional options
 *         func: 'race', // tells PromisE.timeout to use `PromisE.race(promises)`
 *         timeout: 5000, // timeout after 5000ms
 *         timeoutMsg: 'My custom timed out message',
 *     },
 *     PromisE.delay(1000), // resolves after 1000ms with value 1000
 *     PromisE.delay(2000), // resolves after 2000ms with value 2000
 *     PromisE.delay(3000), // resolves after 3000ms with value 3000
 * ).then(console.log)
 * // Result: 1000 (Result of `Promise.race(promises)`)
 * ```
 */
export function timeout<
	T extends [unknown, ...unknown[]], // require at least one value
	Result = T['length'] extends 1 ? Awaited<T[0]> : Awaited<T[number]>[],
>(timeout: number, ...values: T): IPromisE_Timeout<Result>
/**
 *
 * @param options An options object can be passed with one or more of the following properties:
 * @param options.func (optional) Name of the `PromisE` method to be used to combine the `values`.
 * Only used when more than one promise is provided.
 *
 * Accepted values:
 * 1. `'all'` **(default)**: for `PromisE.all`
 * 2. `'allSettled'`: for `PromisE.allSettled`
 * 3. `'any'`: for `PromisE.any`
 * 4. `'race'`: for `PromisE.race`
 *
 * @param options.timeout (optional) timeout duration in milliseconds. Default: `10_000` (10 seconds)
 * @param options.timeoutMsg (optional) custom error message to be used when promises timeout.
 *
 * @param values
 */
export function timeout<
	T extends [unknown, ...unknown[]], // require at least one value
	TFunc extends keyof TimeoutFunc<T>,
	Result = T['length'] extends 1
		? Awaited<T[0]>
		: Awaited<ReturnType<TimeoutFunc<T>[TFunc]>>,
>(options: TimeoutOptions<TFunc>, ...values: T): IPromisE_Timeout<Result>
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
