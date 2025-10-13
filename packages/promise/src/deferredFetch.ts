import { forceCast } from '@superutils/core'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import PromisE_deferred from './deferred'
import PromisE_deferredCallback from './deferredCallback'
import PromisE_fetch from './fetch'
import mergeFetchOptions from './mergeFetchOptions'
import { DeferredOptions, FetchArgs, FetchDeferredArgs } from './types'

/**
 * @function    PromisE.deferredFetch
 * @summary {@link PromisE_fetch} with the advantages of {@link PromisE_deferred} and auto-abort feature
 *
 * @example Fetch paginated products using deferred/throttle mechanism
 * ```typescript
 * import PromisE from '@superutils/promise'
 *
 * const getProducts = PromisE.deferredFetch({
 *     delayMs: 300, // used for both "throttle" and "deferred" modes
 *     resolveIgnored: ResolveIgnored.WITH_LAST,
 *     throttle: true,
 * })
 *
 * // first call
 * getProducts('https://dummyjson.com/products/1').then(console.log)
 * // seconds call after delay
 * setTimeout(()=> getProducts('https://dummyjson.com/products/2').then(console.log), 200)
 *
 * // Possible outcomes using different options:
 * // - `throttle = true`: only product 1 retrieved
 * // - `throttle = false`: only product 2 retrieved
 * // - `resolveIgnored = ResolveIgnored.WITH_LAST`:
 * // 	only product retrieved but both request will resolve the same result
 * // - `resolveIgnored = ResolveIgnored.WITH_UNDEFINED`:
 * // only product 1 retrieved & resolved but the other will resolve with undefined
 * // - `resolveIgnored = ResolveIgnored.NEVER`: only one product retrieved & resolved but the other will NEVER resolve
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
		_abortCtrl = abortCtrl
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
