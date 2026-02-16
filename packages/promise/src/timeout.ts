import {
	arrUnique,
	isFn,
	isNumber,
	isObj,
	isPositiveNumber,
	objCopy,
} from '@superutils/core'
import type {
	IPromisE_Timeout,
	BatchFuncs,
	TimeoutOptions,
	TimeoutOptionsDefault,
	TimeoutResult,
	IPromisE,
} from './types'
import TimeoutPromise, { TIMEOUT_FALLBACK, TIMEOUT_MAX } from './TimeoutPromise'
import PromisEBase from './PromisEBase'
import delayReject from './delayReject'

/**
 * Creates a new promise that wraps one or more promises and rejects if they do not settle within a
 * specified timeout duration. When multiple promises are provided, they can be processed using methods like
 *  `all` (default), `race`, `any`, or `allSettled`.
 *
 * @param timeout (optional) timeout duration in milliseconds.
 * Default: `10_000` (10 seconds)
 *
 * @param values rest param containing one or more promises/values
 *
 * @example Working with a single promise
 * ```typescript
 * import PromisE from '@supertuils/promise'
 *
 * PromisE.timeout(
 *   5000, // timeout after 5000ms
 *   PromisE.delay(1000), // resolves after 1000ms with value 1000
 * ).then(console.log)
 * // Result: 1000
 * ```
 *
 * @example Working with a single function
 * ```typescript
 * import PromisE from '@supertuils/promise'
 *
 * PromisE.timeout(
 *   5000, // timeout after 5000ms
 *   () => PromisE.delay(1000), // function resolves after 1000ms with value 1000
 * ).then(console.log)
 * // Result: 1000
 * ```
 *
 * @example Promise times out & rejected
 * ```typescript
 * import PromisE from '@supertuils/promise'
 *
 * PromisE.timeout(
 *     5000, // timeout after 5000ms
 *     PromisE.delay(20000), // resolves after 20000ms with value 20000
 * ).catch(console.error)
 * // Error: Error('Timed out after 5000ms')
 *```
 *
 * @example Working with multiple promises/functions, resolved using "PromisE.all()"
 *
 * ```typescript
 * import PromisE from '@supertuils/promise'
 *
 * PromisE.timeout(
 *     5000, // timeout after 5000ms
 *     PromisE.delay(1000), // resolves after 1000ms with value 1000
 *     () => PromisE.delay(2000), // resolves after 2000ms with value 2000
 *     PromisE.delay(3000), // resolves after 3000ms with value 3000
 * ).then(console.log)
 * // Result: [ 1000, 2000, 3000 ]
 * ```
 *
 * @example Promise times out & but not rejected.
 * Eg: when API request is taking longer than expected, print a message avoid rejecting the promise.
 * ```typescript
 * import PromisE from '@supertuils/promise'
 *
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
 */
export function timeout<
	T extends [unknown, ...unknown[]], // require at least one value
>(timeout: number, ...values: T): IPromisE_Timeout<TimeoutResult<T, 'all'>>
/**
 *
 * @param options An options object can be passed with one or more of the following properties:
 * @param options.abortCtrl (optional) AbortController to manually reject promise externally and/or to sync abort with timeout rejection
 * @param options.batchFunc (optional) Name of the `PromisE` static method to be used to combine the `values`.
 * Only used when more than one promise is provided. Default: `"all"`
 *
 * Accepted values:
 * 1. `'all'` **(default)**: for `PromisE.all`
 * 2. `'allSettled'`: for `PromisE.allSettled`
 * 3. `'any'`: for `PromisE.any`
 * 4. `'race'`: for `PromisE.race`
 * @param options.onAbort (optional) Callback invoked when the promise is rejected due to an abort signal.
 * Optionally, return an `Error` object to reject the promise with a custom error.
 * @param options.onTimeout (optional) Callback invoked when the promise times out.
 * Optionally, return an `Error` object to reject the promise with a custom error.
 * @param options.signal (optional) AbortSignal to manually reject promise externally
 * @param options.timeout (optional) timeout duration in milliseconds. If positive number is not provided, the default value will be used. Default: `10_000` (10 seconds)
 *
 * @param values Mix of promises, values and/or functions
 *
 * @example Working with multiple promises/functions resolved using "PromisE.race()"
 *
 * ```typescript
 * import PromisE from '@supertuils/promise'
 *
 * PromisE.timeout(
 *     { // instead of `timeout: number` an object can be used for additional options
 *         func: 'race', // tells PromisE.timeout to use `PromisE.race(promises)`
 *         timeout: 5000, // timeout after 5000ms
 *     },
 *     PromisE.delay(1000), // resolves after 1000ms with value 1000
 *     () => PromisE.delay(2000), // resolves after 2000ms with value 2000
 *     PromisE.delay(3000), // resolves after 3000ms with value 3000
 * ).then(console.log)
 * // Result: 1000 (Result of `Promise.race(promises)`)
 * ```
 */
export function timeout<
	T extends unknown[],
	TFunc extends keyof BatchFuncs<T> = keyof BatchFuncs<T>,
>(
	options: TimeoutOptions<T, TFunc>,
	...values: T
): IPromisE_Timeout<TimeoutResult<T, TFunc>>
export function timeout<
	T extends unknown[],
	TFunc extends keyof BatchFuncs<T> = keyof BatchFuncs<T>,
	Result = TimeoutResult<T, TFunc>,
>(
	options: number | TimeoutOptions<T, TFunc>,
	...values: T
): IPromisE_Timeout<Result> {
	// use defualts when option is empty (undefined or '')
	const opts = objCopy(
		timeout.defaults as Record<string, unknown>,
		(isNumber(options)
			? { timeout: options }
			: isObj(options)
				? options
				: {}) as Record<string, unknown>,
		[],
		'empty',
	) as TimeoutOptions
	opts.timeout = Math.min(
		isPositiveNumber(opts.timeout) ? opts.timeout : TIMEOUT_FALLBACK,
		TIMEOUT_MAX,
	)

	// convert function to promises
	const promises = values.map(v =>
		isFn(v) ? PromisEBase.try(v as () => unknown) : v,
	)
	const dataPromise =
		promises.length <= 1
			? // single promise resolves to a single result
				promises[0] instanceof PromisEBase
				? promises[0]
				: new PromisEBase(promises[0])
			: // multiple promises resolve to an array of results
				(isFn(PromisEBase[opts.batchFunc!])
					? PromisEBase[opts.batchFunc!]
					: PromisEBase.all)(promises)
	const timeoutPromise = delayReject<Result>(opts.timeout, opts.onTimeout)
	return new TimeoutPromise<Result>(
		PromisEBase.race([dataPromise, timeoutPromise]) as IPromisE<Result>,
		timeoutPromise,
		opts as unknown as TimeoutOptions,
		arrUnique(
			[opts.abortCtrl?.signal, opts.signal].filter(Boolean),
		) as AbortSignal[],
	)
}
timeout.defaults = {
	abortOnEarlyFinalize: true,
	batchFunc: 'all',
	timeout: TIMEOUT_FALLBACK,
} as TimeoutOptionsDefault

export default timeout
