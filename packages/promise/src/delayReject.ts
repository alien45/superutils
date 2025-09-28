import PromisE_delay from './delay'

/**
 * @name    PromisE.delayReject
 * @summary Creates a promise that rejects after given delay/duration.
 * 
 * @example ```javascript
 * // Example 1: Will reject after 3 seconds
 * const rejectPromise = PromisE.delayReject(
 *     3000, // duration in milliseconds
 *     new Error('App did not initialization on time'), // reason to reject with
 * )
 * await rejectPromise // throws error message after 3 seconds
 * codeThatWillNotExecute()
 * ```
 * 
 * ---
 * 
 * @example ```javascript
 * // Example 2: Cancel the rejectPromise by forcing it to resolve
 * const rejectPromise = PromisE.delayReject(
 *     3000,
 *     new Error('App did not initialization on time'),
 * )
 * const intervalId = setInterval(() => {
 *     if (!appReady()) return
 *     rejectPromise.cancel('force resolves rejectPromise and execution continues')
 *     clearInterval(intervalId)
 * }, 100)
 * await rejectPromise
 * doMoreStuff()
 * ```
 */
export function PromisE_delayReject<T = never>(delay: number, reason?: any) {
    return PromisE_delay<T>(
        delay,
        reason,
        true
    )
}
export default PromisE_delayReject