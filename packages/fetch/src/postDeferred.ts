import { forceCast } from '@superutils/core'
import PromisE, { DeferredOptions } from '@superutils/promise'
import mergeFetchOptions from './mergeFetchOptions'
import post from './post'
import { PostArgs } from './types'

/**
 * @summary	"post", "put" or "patch" requests with the advantages of {@link PromisE.deferred} and auto-abort feature
 *
 *
 * @example HTTP POST: create a producct
 * ```typescript
 * import PromisE from '@superutils/promise'
 *
 * const refreshAuthToken = PromisE.deferredPost(
 * 	{
 * 		delayMs: 300, // debounce delay
 * 		onResult: () =>
 * 			console.log('Auth token updated at', new Date().toISOString()),
 * 	},
 * 	'https://dummyjson.com/auth/refresh',
 * )
 * type TokenRsult = {
 * 	accessToken: string
 * 	refreshToken: string
 * }
 * const handleTokens = ({ accessToken, refreshToken }: TokenRsult) => {
 * 	   localStorage[accessToken] = accessToken
 * 	   localStorage[refreshToken] = refreshToken
 * }
 * cons getBody = () => ({
 * 	   refreshToken: localStorage.refreshToken,
 * 	   expiresInMins: 30,
 * })
 * refreshAuthToken<TokenRsult>(undefined, getBody()).then(handleTokens)
 * refreshAuthToken<TokenRsult>(undefined, getBody()).then(handleTokens)
 * refreshAuthToken<TokenRsult>(undefined, getBody()).then(handleTokens)
 * // only the last call will be executed. Rest will be ignored/aborted by deferred mechanism.
 * ```
 *
 * @example HTTP PUT: auto update a product on change
 * ```typescript
 * import PromisE from '@superutils/promise
 * type Result = { name: string }
 * const updateProduct = PromisE.deferredPost(
 *     {
 *         delayMs: 300, // used for both "throttle" and "deferred" modes
 *         //   resolveIgnored: ResolveIgnored.NEVER, // never resolve ignored requests
 *         onResult: (result: Result) => console.log('Product updated: ', result.name),
 *         throttle: true,
 *         trailing: true, // makes sure the last request is always executed
 *     },
 * 	   'https://dummyjson.com/products/1',
 * 	   undefined,
 * 	   { method: 'put' },
 * )
 * updateProduct<Result>(undefined, { name: 'Product' }).then(console.log)
 * await PromisE.delay(300)
 * updateProduct<Result>(undefined, { name: 'Product N' }).then(console.log)
 * updateProduct<Result>(undefined, { name: 'Product Name' }).then(console.log)
 * updateProduct<Result>(undefined, { name: 'Product Name Updated' }).then(console.log)
 * // Only the first and trailing/last calls will be executed in this case.
 * // Rest will be ignored/aborted by throttle mechanism.
 * ```
 */
export function postDeferred<ThisArg = unknown>(
	deferOptions: DeferredOptions<ThisArg> = {},
	...[defaultUrl, defaultData, defaultOptions]: Partial<PostArgs>
) {
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
		const promise = post<TData>(
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
	return PromisE.deferredCallback(doPost, deferOptions)
}
export default postDeferred
