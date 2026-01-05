import { IPromisE } from '@superutils/promise'
import fetchOriginal from './fetch'
import { FetchAs, FetchOptions, FetchResult } from './types'

/**
 * Drop-in replacement for built-in `fetch()` with with timeout, retry etc options and Response as default return type.
 *
 * @param url request URL
 * @param options (optional) Standard `fetch` options extended with {@link FetchCustomOptions}
 * @param options.as (optional) determines who to parse the result. Default: {@link FetchAs.response}
 * @param options.method (optional) fetch method. Default: `'get'`
 *
 * @example Make a simple HTTP requests
 * ```typescript
 * import { fetchResponse } from '@superutils/fetch'
 *
 * fetchResponse('https://dummyjson.com/products/1')
 *     .then(response => response.json())
 *     .then(console.log, console.error)
 * ```
 */
export const fetchResponse = <
	T = Response,
	TOptions extends FetchOptions = FetchOptions,
	TAs extends FetchAs = TOptions['as'] extends FetchAs
		? TOptions['as']
		: FetchAs.response,
	TReturn = FetchResult<T>[TAs],
>(
	...args: Parameters<typeof fetchOriginal<T, TOptions, TAs, TReturn>>
): IPromisE<TReturn> => {
	args[1] ??= {} as TOptions
	args[1].as ??= FetchAs.response
	return fetchOriginal(...args)
}
export default fetchResponse
