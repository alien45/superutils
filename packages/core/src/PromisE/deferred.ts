import deferred from '../deferred'
import { isFn, isPositiveNumber } from '../is'
import throttled from '../throttled'
import PromisEBase from './PromisEBase'
import {
    IPromisE,
    PromisE_Deferred_Options,
    ResolveIgnored
} from './types'

/** 
 * @name PromisE.deferred
 * @summary the adaptation of the `deferred()` function tailored for Promises.
 * 
 *
 * @param {Object}    o           (optional) options
 * @param {Function}  o.onError   (optional)
 * @param {Function}  o.onIgnore  (optional) invoked whenever callback invocation is ignored by a newer invocation
 * @param {Function}  o.onResult  (optional)
 * @param {ResolveIgnored}  o.resolveIgnored  (optional) see {@link ResolveIgnored}.
 * Default: `PromisE.defaultResolveIgnord` (changeable)
 * 
 * @param {Boolean}   o.throttle  (optional) toggle to switch between debounce/deferred and throttle mode.
 * Requires `defer`.
 * Default: `false`
 * 
 * @returns a callback to add promise/function to defer/throttle queue.
 * 
 * ---
 * 
 * @description The main difference is that:
 *  - Notes: 
 *      1. A "request" simply means invokation of the returned callback function
 *      2. By "handled" it means a "request" will be resolved or rejected.
 *  - `PromisE.deferred` is to be used with promises/functions
 *  - There is no specific time delay.
 *  - The time when a request is completed is irrelevant. 
 *  - If not throttled:
 *      1. Once a request is handled, all previous requests will be ignored and pool starts anew.
 *      2. If a function is provided in the  returned callback, ALL of them will be invoked, regardless of pool size.
 *      3. The last/only request in an on-going requests' pool will handled (resolve/reject).
 *  - If throttled:
 *      1. Once a requst starts executing, subsequent requests will be added to a queue.
 *      2. The last/only item in the queue will be handled. Rest will be ignored.
 *      3. If a function is provided in the returned callback, it will be invoked only if the request is handled. 
 *      Thus, improving performance by avoiding unnecessary invokations.
 *      4. If every single request/function needs to be invoked, avoid using throttle.
 * 
 *  - If throttled and `strict` is truthy, all subsequent request while a request is being handled will be ignored.
 * 
 * ---
 * 
 * @example Explanation & example usage:
 * <BR>
 * ```javascript
 * const example = throttle => {
 *     const df = PromisE.deferred(throttle)
 *     df(() => PromisE.delay(5000)).then(console.log)
 *     df(() => PromisE.delay(500)).then(console.log)
 *     df(() => PromisE.delay(1000)).then(console.log)
 *     // delay 2 seconds and invoke df() again
 *     setTimeout(() => {
 *         df(() => PromisE.delay(200)).then(console.log)
 *     }, 2000)
 * }
 * 
 * // Without throttle
 * example(false)
 * // `1000` and `200` will be printed in the console
 * 
 * // with throttle
 * example(true)
 * // `5000` and `200` will be printed in the console
 * 
 * // with throttle with strict mode
 * example(true)
 * // `5000` will be printed in the console
 * ```
 */
export function PromisE_deferred<T>(options: PromisE_Deferred_Options = {}) {
    let {
        defer = 100,
        onError = () => { },
        onIgnore,
        onResult, // result: whatever is returned from the callback that was not ignored
        resolveIgnored = PromisEBase.defaultResolveIgnored,
        silent = true,
        thisArg,
        throttle: throttle = false,
    } = options
    let lastPromisE: IPromisE<T> | null = null
    interface QueueItem extends ReturnType<typeof PromisEBase.withResolvers<T>> {
        callback: () => Promise<T>,
    }
    const queue: Map<Symbol, QueueItem> = new Map()
    if (thisArg) {
        onError = onError?.bind(thisArg)
        onIgnore = onIgnore?.bind(thisArg)
        onResult = onResult?.bind(thisArg)
    }
    const finalize = <TResolve extends true | false = true>(
        resolve: TResolve,
        queueItem: QueueItem,
    ) => (result: TResolve extends true ? T : any) => {
        queueItem?.[resolve ? 'resolve': 'reject']?.(result)
        const cb = resolve
            ? onResult
            : onError
        cb && PromisEBase.try(cb, result)
    }
    let executor = (id: Symbol, queueItem: QueueItem) => {
        const promise = new PromisEBase(queueItem.callback())
        lastPromisE = promise
        promise.then(
            finalize(true, queueItem),
            finalize(false, queueItem)
        )
        lastPromisE = null
        queue.delete(id)
        if (!queue.size) return

        const queueItems = [...queue.entries()]
        queue.clear()
        // ignore all exising except for the last one
        for(const [_, item] of queueItems) {
            onIgnore && Promise.try(onIgnore, item.callback)

            // Options for ignored 
            // 0. resolve with undefined
            // 1. resolve with most recent value
            // 2. leave unresovled (potential memory leak if not handled properly by consumer)
            switch (resolveIgnored) {
                case ResolveIgnored.WITH_UNDEFINED:
                    item.resolve(undefined as T)
                case ResolveIgnored.WITH_LAST:
                    promise.then(item.resolve)
            }
        }
    }
    if (isPositiveNumber(defer)) {
        const deferFn = throttle
            ? throttled
            : deferred
        executor = deferFn(
            executor,
            defer,
            silent
        )
    }

    const deferPromise = <TResult = T>(promise: Promise<T> | (() => Promise<T>)) => {
        const queueItem = {
            ...PromisEBase.withResolvers<T>(),
            callback: isFn(promise)
                ? promise
                : () => promise
        }
        const id = Symbol('deferred-queue-item-id')
        queue.set(id, queueItem)
        if (!lastPromisE || defer > 0) executor(id, queueItem)
        return queueItem.promise as any as IPromisE<TResult>
    }
    return deferPromise
}
export default PromisE_deferred