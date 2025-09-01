import { KeepFirstN, MakeOptionalLeft } from "../types";
import PromisE from "./PromisE";
import { PostArgs, PromisE_Deferred_Options } from './types'

export function PromisE_deferredPost<
    TData = unknown,
    DefaultArgs extends readonly any[] = KeepFirstN<Partial<PostArgs>, 4>, // exclude default abortCtrl, because each fetch must use it's own abortCtrl
    CbArgs extends readonly unknown[] = MakeOptionalLeft<PostArgs, DefaultArgs['length']>
>(
    deferOptions: PromisE_Deferred_Options<TData> = {},
    ...defaults: DefaultArgs
) {
    let _abortCtrl: AbortController | undefined
    const [
        defaultUrl,
        defaultData,
        defaultOptions,
        defaultTimeout,
    ] = defaults
    const postCallback = (...args: CbArgs) => {
        const [
            url = defaultUrl,
            data = defaultData,
            options = defaultOptions,
            timeout = defaultTimeout,
            abortCtrl = new AbortController()
        ] = args
        // abort any previous fetch
        _abortCtrl?.abort();
        // create a new abort control for current request
        _abortCtrl = args[4] as AbortController
        const postArgs = [
            url,
            data ?? defaultData,
            { ...defaultOptions, ...options },
            timeout ?? defaultOptions,
            abortCtrl,
        ] as PostArgs
        return PromisE.post<TData>(...postArgs)
    }
    return PromisE.deferredCallback(postCallback, deferOptions)
}
export default PromisE_deferredPost