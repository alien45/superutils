import PromisE from "./PromisE"
import { PromisE_Deferred_Options } from './types'

/**
 * 
 * @param PromisE.deferredCallback Callback function
 * @param options {@link PromisE.deferred} options
 * 
 * @returns deferred/throttled callback function
 * 
 * 
 * @example ```javascript
 * const handleChange = (e: { target: { value: number }}) => console.log(e.target.value)
 * const handleChangeDeferred = PromisE.deferredCallback(handleChange, {
 *     defer: 300,
 *     throttle: false, // throttle with delay duration set in `defer`
 * })
 * // simulate click event
 * ;[
 *     100,
 *     150,
 *     200,
 *     550,
 *     580,
 *     600,
 *     1000,
 *     1100,
 * ].forEach(timeout => 
 *     setTimeout(() => handleChangeDeferred({ 
 *        target: { value: timeout }
 *     }), timeout)
 * )
 * 
 * // Result (defer: 300, throttle: true): uses throttled()
 * // 100, 550, 1100
 * 
 * // Result (defer: 300, throttle: false): uses deferred()
 * // 200, 600, 1000
 * ```
 */
export function PromisE_deferredCallback<T = unknown, CbArgs extends any[] = []>(
    callback: (...args: CbArgs) => T | Promise<T>,
    options: PromisE_Deferred_Options<T> = {}
) {
    const { thisArg } = options
    const deferPromise = PromisE.deferred<T>(options)
    if (thisArg !== undefined) callback = callback.bind(thisArg)

    return (...args: CbArgs) => deferPromise(
        () => PromisE.try<T, CbArgs>(callback, ...args)
    )
}
export default PromisE_deferredCallback