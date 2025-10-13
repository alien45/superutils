import PromisE_delay from './delay'

/**
 * @function    PromisE.delayReject
 * @summary Creates a promise that rejects after given delay/duration.
 *
 * @example Create a promise that will rejectafter 3 seconds
 * ```typescript
 * const rejectPromise = PromisE.delayReject(
 *     3000, // duration in milliseconds
 *     new Error('App did not initialization on time'), // reason to reject with
 * )
 * await rejectPromise // throws error message after 3 seconds
 * codeThatWillNotExecute()
 * ```
 *
 * @example Prevent automated promise rejection by forcing it to resolve before timeout
 * ```typescript
 *
 * const rejectPromise = PromisE.delayReject<string>(
 *     3000,
 *     new Error('App did not initialization on time'),
 * )
 * let count = 0
 * const appReady = () => ++count >= 2 // return true on second call
 * const intervalId = setInterval(() => {
 *     if (!appReady()) return
 *     rejectPromise.resolve('force resolves rejectPromise and execution continues')
 *     clearInterval(intervalId)
 * }, 100)
 * await rejectPromise
 * console.log('App is now ready')
 * ```
 */
export function PromisE_delayReject<T = never>(
	delay: number,
	reason?: unknown,
) {
	return PromisE_delay<T>(delay, reason, true)
}
export default PromisE_delayReject
