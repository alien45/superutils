import { fallbackIfFails, isFn } from '@superutils/core'
import PromisEBase from './PromisEBase'
import { IPromisE_Delay } from './types'

/**
 * @function    PromisE.delay
 * @summary Creates a promise that completes after given delay/duration.
 *
 * @param {Number}    duration   duration in milliseconds
 * @param {unknown}   result    (optional) specify a value to resolve or reject with.
 *                              Default: `delayMs` when resolved or timed out error when rejected
 * @param {boolean}   asRejected (optional) if `true`, will reject the promise after the delay.
 *
 * @returns See {@link IPromisE_Delay}
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
	const promise = new PromisEBase() as IPromisE_Delay<T>
	const finalize = (result?: unknown) => {
		if (isFn(result))
			result = fallbackIfFails(result, [], undefined) ?? duration
		if (!asRejected) return promise.resolve(result as T)

		// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
		promise.reject(
			result
				?? new Error(`${delay.defaults.delayTimeoutMsg} ${duration}ms`),
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
delay.defaults = {
	/** Default delay duration in milliseconds */
	duration: 100,
	/** Default timed out message */
	delayTimeoutMsg: 'Timed out after',
}
export default delay
