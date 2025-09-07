import PromisEBase from './PromisEBase'
import { IPromisE_Delay } from './types'

/**
 * @name    PromisE.delay
 * @summary Creates a promise that completes after given delay/duration.
 * 
 * @param {Number}    duration   duration in milliseconds
 * @param {unknown}   result    (optional) specify a value to resolve or reject with.
 *                              Default: `delayMs` when resolved or timed out error when rejected
 * @param {boolean}   asRejected (optional) if `true`, will reject the promise after the delay.
 * 
 * @returns See {@link IPromisE_Delay}
 * 
 * @example ```javascript
 * console.log('Waiting for app initialization or something else to be ready')
 * // wait 3 seconds before proceeding
 * await PromisE.delay(3000)
 * console.log('App ready')
 * ```
 */
export function PromisE_delay<T = number>(
    duration: number,
    result: T = duration as T,
    asRejected: boolean = false,
    timeoutErrMsg?: string,
) {
    const { 
        promise: _promise,
        reject,
        resolve
    } = PromisEBase.withResolvers<T>()
    const promise = _promise as IPromisE_Delay<T>
    const finalize = (result?: T | Error, doReject = false) => {
        if (!promise.pending) return

        !doReject
            ? resolve((result ?? duration) as T)
            : reject(result ?? new Error(timeoutErrMsg ?? `Timed out after ${duration}ms`))
    }
    promise.timeoutId = setTimeout(
        () => finalize(result, asRejected),
        duration
    )
    promise.pause = () => clearTimeout(promise.timeoutId)
    promise.catch(() => {}).finally(() => promise.pause())
    return promise
}
export default PromisE_delay