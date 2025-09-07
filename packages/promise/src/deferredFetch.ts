import { forceCast, MakeOptional } from '@utiils/core'
import PromisE_deferred from './deferred'
import PromisE_deferredCallback from './deferredCallback'
import PromisE_fetch from './fetch'
import mergeFetchOptions from './mergeFetchOptions'
import {
    PromisE_Deferred_Options,
    PromisE_FetchArgs,
    PromisE_FetchDeferredArgs
} from './types'

type Defaults = PromisE_FetchDeferredArgs
/**
 * @name    PromisE.deferredFetch
 * @summary {@link PromisE_fetch} with the advantages of {@link PromisE_deferred} and auto-abort feature
 * 
 * @example ```javascript
 * ---
 * // Example: Fetch paginated products
 * const getProducts = PromisE.deferredFetch({
 *     defer: 300, // used for both "throttle" and "deferred" modes
 *     resolveIgnored: ResolveIgnored.WITH_ACTIVE,
 *     throttle: true,
 * })
 * getProducts('https://dummyjson.com/products/1').then(console.log)
 * setTimeout(()=> getProducts('https://dummyjson.com/products/2').then(console.log), 200)
 * // result (throttle = true): only product 1 retrieved
 * 
 * // result (throttle = false): only product 2 retrieved
 * 
 * // result (ResolveIgnored.WITH_ACTIVE): only product retrieved but both request will resolve the same result
 * 
 * // result (ResolveIgnored.WITH_UNDEFINED): only one product retrieved & resolved but the other will resolve with undefined
 * 
 * // result (ResolveIgnored.NEVER): only one product retrieved & resolved but the other will NEVER resolve
 * ```
 */    
export function PromisE_deferredFetch<
    const TArgs extends Defaults = Defaults,
>(
    deferOptions: PromisE_Deferred_Options = {},
    ...[
        defaultUrl,
        defaultOptions = {},
        defaultTimeout,
        defaultErrMsgs,
    ]: TArgs
) {
    let _abortCtrl: AbortController | undefined
    type CbArgs = MakeOptional<PromisE_FetchArgs, 0, TArgs['length']>
    const fetchCallback = <TCbData = unknown>(...[
        url,
        options,
        timeout,
        abortCtrl = new AbortController(),
        errMsgs,
    ]: CbArgs) => {
        // abort any previous fetch
        _abortCtrl?.abort()
        _abortCtrl = abortCtrl as AbortController
        const promise = PromisE_fetch<TCbData>(
            ...forceCast<PromisE_FetchArgs>([
                url ?? defaultUrl,
                mergeFetchOptions(defaultOptions, options ?? {}),
                timeout ?? defaultTimeout,
                abortCtrl,
                errMsgs ?? defaultErrMsgs,
            ])
        )
        // abort fetch request if promise is finalized manually before completion
        // by invoking `promise.reject()` or `promise.resolve()
        promise.onEarlyFinalize.push(() => _abortCtrl?.abort())
        return promise
    }
    return PromisE_deferredCallback(fetchCallback, deferOptions)
}
export default PromisE_deferredFetch