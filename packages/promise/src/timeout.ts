import {
	arrUnique,
	fallbackIfFails,
	isFn,
	isObj,
	isPositiveNumber,
	noop,
	objCopy,
} from '@superutils/core'
import delayReject from './delayReject'
import PromisEBase from './PromisEBase'
import type {
	IPromisE,
	IPromisE_Delay,
	IPromisE_Timeout,
	TimeoutFunc,
	TimeoutOptions,
	TimeoutOptionsDefault,
	TimeoutResult,
} from './types'

/** Timeout duration (in milliseconds) used as a fallback when positive number is not provided to {@link timeout} */
export const FALLBACK_TIMEOUT = 10_000

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
 * @param options.func (optional) Name of the `PromisE` static method to be used to combine the `values`.
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
	TFunc extends keyof TimeoutFunc<T> = keyof TimeoutFunc<T>,
>(
	options: TimeoutOptions<T, TFunc>,
	...values: T
): IPromisE_Timeout<TimeoutResult<T, TFunc>>
export function timeout<
	T extends unknown[],
	TFunc extends keyof TimeoutFunc<T> = keyof TimeoutFunc<T>,
	Result = TimeoutResult<T, TFunc>,
>(
	timeoutOrOptions: number | TimeoutOptions<T, TFunc>,
	...values: T
): IPromisE_Timeout<Result> {
	// use defualts when option is empty (undefined or '')
	const options = objCopy(
		timeout.defaults,
		isObj(timeoutOrOptions)
			? timeoutOrOptions
			: { timeout: timeoutOrOptions },
		[],
		'empty',
	) as Required<TimeoutOptions>
	const { func, onTimeout } = options
	const duration = isPositiveNumber(options.timeout)
		? options.timeout
		: FALLBACK_TIMEOUT

	// convert function to promises
	const arrPromises = values.map(v => (isFn(v) ? PromisEBase.try(v) : v))
	const dataPromise = (
		arrPromises.length <= 1
			? // single promise resolves to a single result
				arrPromises[0] instanceof PromisEBase
				? arrPromises[0]
				: new PromisEBase<T[0]>(arrPromises[0])
			: // multiple promises resolve to an array of results
				(isFn(PromisEBase[func]) ? PromisEBase[func] : PromisEBase.all)(
					arrPromises,
				)
	) as PromisEBase<Result> // array of promises resolves to an array of results

	// promise that times out after given duration
	const timeoutPromise = delayReject<Result>(duration, onTimeout)
	const promise = PromisEBase.race([
		dataPromise,
		timeoutPromise,
	]) as IPromisE_Timeout<Result>

	addPropsNListeners(promise, dataPromise, timeoutPromise, options)

	return promise
}
timeout.defaults = {
	func: 'all',
	timeout: FALLBACK_TIMEOUT,
} as TimeoutOptionsDefault

export default timeout

const addPropsNListeners = <T extends unknown[], TFunc extends string, Result>(
	promise: IPromisE_Timeout<Result>,
	dataPromise: IPromisE<Result>,
	timeoutPromise: IPromisE_Delay<Result>,
	options: Required<TimeoutOptions<T, TFunc>>,
) => {
	const { abortCtrl, onAbort, signal } = options
	const signals = arrUnique([abortCtrl?.signal, signal].filter(Boolean))

	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	Object.defineProperties(promise, {
		aborted: {
			get() {
				return promise.rejected && !!signals.find(s => s.aborted)
			},
		},
		cancelAbort: {
			get() {
				return () => {
					signals?.forEach(signal =>
						signal.removeEventListener('abort', handleAbort),
					)
				}
			},
		},
		clearTimeout: {
			get() {
				return () => clearTimeout(timeoutPromise.timeoutId)
			},
		},
		data: {
			get() {
				return dataPromise
			},
		},
		timeout: {
			get() {
				return timeoutPromise
			},
		},
		timedout: {
			get() {
				return promise.rejected && timeoutPromise.rejected
			},
		},
	})

	const cleanup = () => {
		// remove all event listeners and timeouts
		promise.cancelAbort()
		promise.clearTimeout()
	}

	// if promise is finalized externally remove all listeners and clear timeout
	promise.onEarlyFinalize.push(cleanup)

	// cleanup after execution
	promise
		.catch(() => {
			/* avoid unhandled rejections here */
			if (!timeoutPromise.rejected && !signals.find(x => x.aborted))
				return
			// abort if abortCtrl provided
			abortCtrl?.signal?.aborted === false && abortCtrl.abort()
		})
		.finally(cleanup)

	if (!signals.length) return

	const started = new Date()
	function handleAbort() {
		if (!promise.pending) return

		fallbackIfFails(async () => await onAbort?.(), [], undefined).then(
			err => {
				err ??= new Error(
					`Aborted after ${new Date().getTime() - started.getTime()}ms`,
				)
				err.name ??= 'AbortError'
				promise.reject(err)
			},
			noop,
		)
	}
	// listen to controller/signal events and reject when appropriate
	signals.forEach(signal => signal.addEventListener('abort', handleAbort))
}
