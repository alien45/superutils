import { fallbackIfFails } from '@superutils/core'
import PromisEBase from './PromisEBase'
import { IPromisE_Delay } from './types'

/**
 * Creates a promise that completes after given delay/duration.
 *
 * Also accessible from the `PromisE` class as `PromisE.delay()`.
 *
 * @param duration duration in milliseconds. Default: `100`
 * @param result (optional) specify a value to resolve or error to reject with.
 *
 * Alternatively, a function (with no arguments) can be provided that returns the result.
 *
 * Default: `delayMs` when resolved or timed out error when rejected
 * @param asRejected (optional) if `true`, will reject the promise after the delay.
 *
 * @returns promise
 *
 * @example Create a  promise that resolves after specified delay.
 * ```typescript
 * import PromisE from '@superutils/promise'
 *
 * // Resolves after 1 second delay
 * PromisE.delay(1000).then(console.log)
 * ```
 *
 * @example Execute a function after delay.
 * An awaitable `setTimeout()`.
 * ```typescript
 * import PromisE from '@superutils/promise'
 *
 * PromisE.delay(1000, () => console.log('Prints after 1 second delay'))
 * ```
 *
 * @example Delay before continuing execution
 * ```typescript
 * import PromisE from '@superutils/promise'
 *
 * const func = async () => {
 *     console.log('Waiting for app initialization or something else to be ready')
 *     // wait 3 seconds before proceeding
 *     await PromisE.delay(3000)
 *     console.log('App ready')
 * }
 * func()
 * ```
 */
export function delay<T = number, TReject extends boolean = boolean>(
	duration = delay.defaults.duration,
	result?: T | (() => T),
	asRejected: TReject = false as TReject,
) {
	const promise = new PromisEBase() as unknown as IPromisE_Delay<T>
	const finalize = (result?: unknown) => {
		result = // if a function is provided execute it and turn it into a promise
			fallbackIfFails(result, [], (err: Error) => Promise.reject(err))
		if (!asRejected) return promise.resolve((result ?? duration) as T)

		promise.reject(
			(duration !== result && result !== undefined
				? result
				: new Error(
						`${delay.defaults.delayTimeoutMsg} ${duration}ms`,
					)) as Error,
		)
	}
	promise.timeoutId = setTimeout(() => finalize(result), duration)
	promise.pause = () => clearTimeout(promise.timeoutId)
	promise
		.catch(() => {
			/* avoid unhandled rejections here when asRejected is true */
		})
		.finally(() => promise.pause())
	return promise
}
/** Global default values */
delay.defaults = {
	/** Default delay duration in milliseconds */
	duration: 100,
	/** Default timed out message (if `result` is not provided) */
	delayTimeoutMsg: 'Timed out after',
}
export default delay
