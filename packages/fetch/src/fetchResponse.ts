import { IPromisE } from '@superutils/promise'
import fetch from './fetch'
import { FetchArgs, FetchAs, FetchOptions, FetchResult } from './types'

/**
 * Drop-in replacement for built-in `fetch()` with with timeout, retry etc options and Response as default return type.
 *
 * @param url request URL
 * @param options (optional) Standard `fetch` options extended with "FetchCustomOptions"
 *
 * @example Make a simple HTTP requests
 * ```javascript
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
	url: FetchArgs[0],
	options: Parameters<typeof fetch<T, TOptions, TAs, TReturn>>[1],
): IPromisE<TReturn> => {
	options ??= {} as TOptions
	options.as ??= FetchAs.response
	return fetch(url, options)
}
export default fetchResponse
