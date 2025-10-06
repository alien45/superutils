import { forceCast } from '@utiils/core'
import PromisE_deferred from './deferred'
import PromisE_deferredCallback from './deferredCallback'
import PromisE_fetch from './fetch'
import mergeFetchOptions from './mergeFetchOptions'
import { DeferredOptions, FetchArgs, FetchDeferredArgs } from './types'

/**
 * @name    PromisE.deferredFetch
 * @summary {@link PromisE_fetch} with the advantages of {@link PromisE_deferred} and auto-abort feature
 *
 * @example ```javascript
 * ---
 * // Example: Fetch paginated products
 * const getProducts = PromisE.deferredFetch({
 *     delayMs: 300, // used for both "throttle" and "deferred" modes
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
	TArgs extends FetchDeferredArgs,
	ThisArg = unknown,
>(deferOptions: DeferredOptions<ThisArg> = {}, ...defaultArgs: TArgs) {
	const [defaultUrl, defaultOptions = {}] = defaultArgs
	let _abortCtrl: AbortController | undefined
	type CbArgs = TArgs[0] extends undefined ? FetchArgs : Partial<FetchArgs>
	const fetchCallback = <TCbData = unknown>(...args: CbArgs) => {
		const [url, options = {}] = args
		options.abortCtrl ??= new AbortController()
		options.timeout ??= defaultOptions.timeout
		options.errMsgs = { ...defaultOptions.errMsgs, ...options.errMsgs }
		const { abortCtrl } = options
		// abort any previous fetch
		_abortCtrl?.abort()
		_abortCtrl = abortCtrl as AbortController
		const promise = PromisE_fetch<TCbData>(
			...forceCast<FetchArgs>([
				url ?? defaultUrl,
				mergeFetchOptions(defaultOptions, options),
			]),
		)
		// abort fetch request if promise is finalized manually before completion
		// by invoking `promise.reject()` or `promise.resolve()
		promise.onEarlyFinalize.push(() => _abortCtrl?.abort())
		return promise
	}
	return PromisE_deferredCallback(fetchCallback, deferOptions)
}
export default PromisE_deferredFetch
