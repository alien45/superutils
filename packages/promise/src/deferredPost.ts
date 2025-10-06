import { forceCast } from '@utiils/core'
import PromisE_deferredCallback from './deferredCallback'
import mergeFetchOptions from './mergeFetchOptions'
import PromisE_post from './post'
import { DeferredOptions, PostDeferredArgs, PostArgs } from './types'

export function PromisE_deferredPost<
	TArgs extends PostDeferredArgs,
	ThisArg = unknown,
>(deferOptions: DeferredOptions<ThisArg> = {}, ...defaultArgs: TArgs) {
	const [defaultUrl, defaultData, defaultOptions = {}] = defaultArgs
	let _abortCtrl: AbortController | undefined
	type CbArgs = TArgs[0] extends undefined ? PostArgs : Partial<PostArgs>
	const doPost = <TData = unknown>(...[url, data, options]: CbArgs) => {
		// abort any previous fetch
		_abortCtrl?.abort()
		// create a new abort control for current request
		_abortCtrl = options?.abortCtrl as AbortController
		const promise = PromisE_post<TData>(
			...forceCast<PostArgs>([
				url ?? defaultUrl,
				data ?? defaultData,
				mergeFetchOptions(options ?? {}, defaultOptions),
			]),
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
