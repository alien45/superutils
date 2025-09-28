import { forceCast, MakeOptional } from '@utiils/core'
import PromisE_deferredCallback from './deferredCallback'
import mergeFetchOptions from './mergeFetchOptions'
import PromisE_post from './post'
import {
    PromisE_Deferred_Options,
    PromisE_PostDeferredArgs,
    PromisE_PostArgs
} from './types'

export function PromisE_deferredPost<
    TArgs extends PromisE_PostDeferredArgs,
    ThisArg = unknown,
>(
    deferOptions: PromisE_Deferred_Options<ThisArg> = {},
    ...defaultArgs: TArgs
) {
    const [
        defaultUrl,
        defaultData,
        defaultOptions,
        defaultTimeout,
    ] = defaultArgs
    let _abortCtrl: AbortController | undefined
    type CbArgs = TArgs[0] extends undefined
        ? PromisE_PostArgs
        : Partial<PromisE_PostArgs>
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