import PromisE from "./PromisE"
import { PromisE_Delay } from "./types"

/**
 * @name    PromisE.delay
 * @summary Creates a promise that completes after given delay/duration.
 * 
 * @param {Number}    delayMs   duration in milliseconds
 * @param {unknown}   result    (optional) specify a value to resolve or reject with.
 *                              Default: `delayMs` when resolved or timed out error when rejected
 * @param {boolean}   asRejected (optional) if `true`, will reject the promise after the delay.
 * 
 * @returns See {@link PromisE_Delay}
 * 
 * @example ```javascript
 * console.log('Waiting for app initialization or something else to be ready')
 * // wait 3 seconds before proceeding
 * await PromisE.delay(3000)
 * console.log('App ready')
 * ```
 */
export function PromisE_delay <T = number>(
    delayMs: number,
    result: T = delayMs as T,
    asRejected: boolean = false,
    timeoutErrMsg = 'Timed out after'
) {
    const { 
        promise: _promise,
        reject,
        resolve
    } = PromisE.withResolvers<T>()
    const promise = _promise as PromisE_Delay<T>
    const finalize = (result?: T | Error, doReject = false) => {
        if (!promise.pending) return

        !doReject 
            ? resolve((result ?? delayMs) as T)
            : reject(result ?? new Error(`${timeoutErrMsg} ${delayMs}ms`))
    }
    promise.timeoutId = setTimeout(
        () => finalize(result, asRejected),
        delayMs
    )
    promise.pause = () => clearTimeout(promise.timeoutId)
    promise.catch(() => {}).finally(() => promise.pause())
    return promise
}
export default PromisE_delay