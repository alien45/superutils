import { fallbackIfFails, isFn } from '@superutils/core'
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
 * @returns a promise
 *
 * @example Delay before continuing execution
 * ```typescript
 * import PromisE from '@superutils/promise'
 *
 * console.log('Waiting for app initialization or something else to be ready')
 * // wait 3 seconds before proceeding
 * await PromisE.delay(3000)
 * console.log('App ready')
 * ```
 *
 * @example Execute a function after delay.
 * An awaitable `setTimeout()`.
 * ```typescript
 * import PromisE from '@superutils/promise'
 *
 * PromisE.delay(1000, () => console.log('Prints after 1 second delay'))
 * ```
 */
export function delay<T = number, TReject extends boolean = boolean>(
	duration = delay.defaults.duration,
	result: T | (() => T) = duration as T,
	asRejected: TReject = false as TReject,
) {
	const promise = new PromisEBase() as unknown as IPromisE_Delay<T>
	const finalize = (result?: unknown) => {
		if (isFn(result))
			result = fallbackIfFails(result, [], undefined) ?? duration
		if (!asRejected) return promise.resolve(result as T)

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
