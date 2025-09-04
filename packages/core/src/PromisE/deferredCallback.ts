import PromisE_deferred from "./deferred"
import PromisEBase from "./PromisEBase"
import { PromisE_Deferred_Options } from './types'

/**
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

export function PromisE_deferredCallback<TDefault = unknown, CbArgs extends any[] = []>(
    callback: (...args: CbArgs) => TDefault | Promise<TDefault>,
    options: PromisE_Deferred_Options = {}
) {
    const { thisArg } = options
    if (thisArg !== undefined) {
        callback = callback.bind(thisArg)
        options = {...options, thisArg: undefined }
    }
    const deferPromise = PromisE_deferred<TDefault>(options)
    
    return <TResult = TDefault>(...args: CbArgs) => deferPromise<TResult>(
        () => PromisEBase.try(callback, ...args)
    )
}
export default PromisE_deferredCallback