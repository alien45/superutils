import { forceCast, MakeOptional } from '@utiils/core'
import PromisE_deferredCallback from './deferredCallback'
import mergeFetchOptions from './mergeFetchOptions'
import PromisE_post from './post'
import {
    PromisE_Deferred_Options,
    PromisE_PostDeferredArgs,
    PromisE_PostArgs
} from './types'

type Defaults = PromisE_PostDeferredArgs
export function PromisE_deferredPost<const TArgs extends Defaults = Defaults>(
    deferOptions: PromisE_Deferred_Options = {},
    ...[
        defaultUrl,
        defaultData,
        defaultOptions,
        defaultTimeout,
    ]: TArgs
) {
    let _abortCtrl: AbortController | undefined
    type CbArgs = MakeOptional<PromisE_PostArgs, 0, TArgs['length']>
    const doPost = <TData = unknown>(...[
        url,
        data,
        options,
        timeout,
        abortCtrl = new AbortController()
    ]: CbArgs) => {
        // abort any previous fetch
        _abortCtrl?.abort()
        // create a new abort control for current request
        _abortCtrl = abortCtrl as AbortController
        const promise = PromisE_post<TData>(
            ...forceCast<PromisE_PostArgs>([
                url ?? defaultUrl,
                data ?? defaultData,
                mergeFetchOptions(options ?? {}, defaultOptions),
                timeout ?? defaultTimeout,
                abortCtrl,
            ])
        )
        // abort post request if promise is finalized manually before completion
        // by invoking `promise.reject()` or `promise.resolve()`
        promise.onEarlyFinalize.push(() => _abortCtrl?.abort())
        return promise
    }
    const postCb = PromisE_deferredCallback(doPost, deferOptions)
    return postCb
}
export default PromisE_deferredPost