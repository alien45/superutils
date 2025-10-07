import { forceCast } from '@utiils/core'
import PromisE_deferredCallback from './deferredCallback'
import mergeFetchOptions from './mergeFetchOptions'
import PromisE_post from './post'
import { DeferredOptions, PostArgs } from './types'

export function PromisE_deferredPost<
	// TUrl extends string | URL,
	ThisArg = unknown,
>(
	deferOptions: DeferredOptions<ThisArg> = {},
	// defaultUrl?: TUrl,
	...[defaultUrl, defaultData, defaultOptions]: Partial<PostArgs>
) {
	// const [defaultUrl, defaultData, defaultOptions = {}] = defaultArgs
	let _abortCtrl: AbortController | undefined
	type CbArgs = typeof defaultUrl extends undefined
		? PostArgs
		: Partial<PostArgs>
	const doPost = <TData = unknown>(...[url, data, options = {}]: CbArgs) => {
		options.abortCtrl ??= new AbortController()
		// abort any previous fetch
		_abortCtrl?.abort()
		// create a new abort control for current request
		_abortCtrl = options.abortCtrl
		const mergedOptions = mergeFetchOptions(options, defaultOptions ?? {})
		const promise = PromisE_post<TData>(
			...forceCast<PostArgs>([
				url ?? defaultUrl,
				data ?? defaultData,
				mergedOptions,
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
