import fetch from './fetch'
import {
	FetchArgs,
	FetchAs,
	FetchOptions,
	FetchOptionsDefault,
	FetchResult,
} from './types'

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
	options?: Parameters<typeof fetch<T, TOptions, TAs, TReturn>>[1],
) => {
	options ??= {} as TOptions
	options.as ??= FetchAs.response
	return fetch<TReturn>(url, options)
}
fetchResponse.defaults = fetch.defaults
// Sync with fetch.defaults
Object.defineProperty(fetchResponse, 'defaults', {
	get() {
		return fetch.defaults
	},
	set(newDefaults: FetchOptionsDefault) {
		fetch.defaults = newDefaults
	},
})
export default fetchResponse
