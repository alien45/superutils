import {
    deferred,
    forceCast,
    isFn,
    isPositiveNumber,
    throttled,
} from '@utiils/core'
import PromisEBase from './PromisEBase'
import {
    IPromisE,
    PromisE_Deferred_Options,
    ResolveError,
    ResolveIgnored
} from './types'

/** 
 * @name PromisE.deferred
 * @summary the adaptation of the `deferred()` function tailored for Promises.
 * 
 *
 * @param options           (optional) options
 * @param options.delayMs (optional) delay in milliseconds to be used with debounce & throttle modes.
 * @param options.onError   (optional)
 * @param options.onIgnore  (optional) invoked whenever callback invocation is ignored by a newer invocation
 * @param options.onResult  (optional)
 * @param options.resolveIgnored  (optional) see {@link ResolveIgnored}.
 * Default: `PromisE.defaultResolveIgnord` (changeable)
 * 
 * @param options.throttle  (optional) toggle to switch between debounce/deferred and throttle mode.
 * Requires `defer`.
 * Default: `false`
 * 
 * @returns a callback that is invoked in one of the followin 3 methods:
 * - sequential: when `delayMs` is not a positive number.
 * - debounced: when `delayMs > 0` and `throttle = false`
 * - throttled: when `delayMs > 0` and `throttle = true`
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
        delayMs = 100,
        onError,
        onIgnore,
        onResult,
        resolveError = ResolveError.REJECT, // by default reject on error
        resolveIgnored = PromisEBase.defaultResolveIgnored,
        thisArg,
        throttle = false,
    } = options
    let lastPromisE: IPromisE<unknown> | null = null
    interface QueueItem extends ReturnType<typeof PromisEBase.withResolvers<unknown>> {
        callback: () => Promise<unknown>
        started?: boolean
    }
    const queue: Map<Symbol, QueueItem> = new Map()
    const gotDelay = isPositiveNumber(delayMs)
    if (thisArg !== undefined) {
        onError = onError?.bind(thisArg)
        onIgnore = onIgnore?.bind(thisArg)
        onResult = onResult?.bind(thisArg)
    }
    const ignoreOrProceed = (currentId: Symbol, qItem?: QueueItem) => {
        lastPromisE = null
        if (!gotDelay) {
            queue.delete(currentId)
            const [nextId, nextItem] = [...queue.entries()][0] || []
            return nextId
                && nextItem
                && execute(nextId, nextItem)
        }
        
        const items = [...queue.entries()]
        const currentIndex = items.findIndex(([id]) => id === currentId)
        for (let i = 0; i <= currentIndex; i++) {
            const [iId, iItem] = items[i] || []
            queue.delete(iId)
            if (!iItem || iItem.started) continue

            onIgnore && Promise.try(onIgnore, iItem.callback)

            // Options for ignored 
            // 0. resolve with undefined
            // 1. resolve with most recent value
            // 2. leave unresovled (potential memory leak if not handled properly by consumer)
            switch (resolveIgnored) {
                case ResolveIgnored.WITH_UNDEFINED:
                    iItem.resolve(undefined as T)
                    break
                case ResolveIgnored.WITH_LAST:
                    // error will not be passed down to ignored ones
                    iItem.resolve(qItem?.promise?.catch(() => {}))
                    break
                case ResolveIgnored.NEVER:
                    // just ignore
                    break
            }
        }
    }
    const execute = (() => {
        const finalize = <TResolve extends true | false = true>(
            resolve: TResolve,
            id: Symbol,
            qItem = queue.get(id),
        ) => (resultOrErr: TResolve extends true ? unknown : any) => {
            ignoreOrProceed(id, qItem)
            if (!qItem) return
            if (resolve) {
                qItem.resolve(resultOrErr)
                onResult && Promise.try(onResult, resultOrErr)
                return
            }
    
            onError && Promise.try(onError, resultOrErr)
            switch(resolveError) {
                case ResolveError.NEVER: break
                case ResolveError.REJECT:
                    qItem.reject(resultOrErr)
                    break
                case ResolveError.WITH_ERROR:
                    qItem.resolve(resultOrErr)
                    break
                case ResolveError.WITH_UNDEFINED:
                    qItem.resolve(undefined)
                    break
            }
        }
        const execute = (id: Symbol, queueItem: QueueItem) => {
            queueItem.started = true
            lastPromisE = new PromisEBase(queueItem.callback())
            lastPromisE.then(
                finalize(true, id),
                finalize(false, id),
            )
        }
        if (!gotDelay) return execute

        const deferFn = throttle
            ? throttled
            : deferred
        return deferFn(
            execute,
            delayMs,
            options,
        )
    })()
    
    let count = 0
    const deferPromise = <TResult = T>(promise: Promise<TResult> | (() => Promise<TResult>)) => {
        const qItem = {
            ...PromisEBase.withResolvers<unknown>(),
            callback: isFn(promise)
                ? promise
                : () => promise
        }
        const id = forceCast<Symbol>(++count) //Symbol('deferred-queue-item-id')
        queue.set(id, qItem)
        if (gotDelay || !lastPromisE) {
            execute(id, qItem)
        }
        return forceCast<IPromisE<TResult>>(qItem.promise)
    }
    return deferPromise
}
export default PromisE_deferred