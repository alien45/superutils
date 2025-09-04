import { MakeOptionalLeft } from "../types"
import PromisE_deferredCallback from "./deferredCallback"
import mergeFetchOptions from "./mergeFetchOptions"
import PromisE_post from "./post"
import {
    IPromisE,
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
    type CbArgs = MakeOptionalLeft<PromisE_PostArgs, TArgs['length']>
    const doPost = <TData = unknown>(...[
        url = defaultUrl,
        data = defaultData,
        options,
        timeout = defaultTimeout,
        abortCtrl = new AbortController()
    ]: CbArgs) => {
        // abort any previous fetch
        _abortCtrl?.abort()
        // create a new abort control for current request
        _abortCtrl = abortCtrl as AbortController
        const postArgs = [
            url ?? defaultUrl,
            data,
            mergeFetchOptions(options ?? {}, defaultOptions),
            timeout ?? defaultOptions,
            abortCtrl,
        ] as any as PromisE_PostArgs
        return PromisE_post(...postArgs) as IPromisE<TData>
    }
    const postCb = PromisE_deferredCallback(doPost, deferOptions)
    return postCb
}
export default PromisE_deferredPost