/* eslint-disable @typescript-eslint/no-unused-vars */
import createFetchMethodFunc from './createFetchMethodFunc'
import createPostMethodFunc from './createPostMethodFunc'
import fetchOriginal from './fetch'
import fetchResponse from './fetchResponse'
import { FetchCustomOptions, FetchInterceptors } from './types'

const _get = createFetchMethodFunc('get')
const _head = createFetchMethodFunc('head')
const _options = createFetchMethodFunc('options')
// Post-like methods that allow `options.body`
const _delete = createPostMethodFunc('delete')
const _patch = createPostMethodFunc('patch')
const _post = createPostMethodFunc('post')
const _put = createPostMethodFunc('put')

export type FetchWithMethods = typeof fetchResponse & {
	/** Default options */
	defaults: typeof fetchOriginal.defaults
	/** Make HTTP `DELETE` request, result automatically parsed as JSON */
	delete: typeof _delete
	/** Make HTTP `GET` request, result automatically parsed as JSON */
	get: typeof _get
	/** Make HTTP `HEAD` request, result automatically parsed as JSON */
	head: typeof _head
	/** Make HTTP `OPTIONS` request, result automatically parsed as JSON */
	options: typeof _options
	/** Make HTTP `PATCH` request, result automatically parsed as JSON */
	patch: typeof _patch
	/** Make HTTP `POST` request, result automatically parsed as JSON */
	post: typeof _post
	/** Make HTTP `PUT` request, result automatically parsed as JSON */
	put: typeof _put
}

/**
 * A `fetch()` replacement that simplifies data fetching with automatic JSON parsing, request timeouts, retries,
 * and handy interceptors that also work as transformers. It also includes deferred and throttled request
 * capabilities for complex asynchronous control flows.
 *
 * Will reject promise if response status code is not 2xx (200 <= status < 300).
 *
 * ## Method Specific Functions
 *
 * While `fetch()` provides access to all HTTP request methods by specifying it in options (eg: `{ method: 'get' }`),
 * for ease of use you can also use the following:
 *
 * - `fetch.delete(...)`
 * - `fetch.get(...)`
 * - `fetch.head(...)`
 * - `fetch.options(...)`
 * - `fetch.patch(...)`
 * - `fetch.post(...)`
 * - `fetch.put(...)`
 *
 * **Deferred variants:** To debounce/throttle requests.
 *
 * - `fetch.delete.deferred(...)`
 * - `fetch.get.deferred(...)`
 * - `fetch.head.deferred(...)`
 * - `fetch.options.deferred(...)`
 * - `fetch.patch.deferred(...)`
 * - `fetch.post.deferred(...)`
 * - `fetch.put.deferred(...)`
 *
 * @template T The type of the value that the `fetch` resolves to.
 * @template TReturn Return value type.
 *
 * If `T` is not specified defaults to the following based on the value of `options.as`:
 * - FetchAs.arrayBuffer: `ArrayBuffer`
 * - FetchAs.blob: `Blob`
 * - FetchAs.bytes: `Uint8Array<ArrayBuffer>`
 * - FetchAs.formData: `FormData`
 * - FetchAs.json: `unknown`
 * - FetchAs.text: `string`
 * - FetchAs.response: `Response`
 * @param url
 * @param options (optional) Standard `fetch` options extended with {@link FetchCustomOptions}
 * @param options.as (optional) determines who to parse the result. Default: {@link FetchAs.response}
 * @param options.headers (optional) request headers
 * Default: `{ 'content-type': `'application/json' }` (unless changed in the fetch.defaults).
 * @param options.method (optional) fetch method. Default: `'get'`
 *
 * Options' default values (excluding `as`, `method` and `retryIf`) can be configured to be EFFECTIVE GLOBALLY.
 *
 * ```typescript
 * import fetch from '@superutils/fetch'
 *
 * fetch.defaults = {
 *     errMsgs: {
 *        invalidUrl: 'Invalid URL',
 *        parseFailed: 'Failed to parse response as',
 *        reqTimedout: 'Request timed out',
 *        requestFailed: 'Request failed with status code:',
 *     },
 *     headers: new Headers([['content-type', 'application/json']]),
 * 	   // Global/application-wide Interceptor & Transfermers
 *     interceptors: {
 *     	   error: [],
 *     	   request: [],
 *     	   response: [],
 *     	   result: [],
 *     },
 *     timeout: 0,
 *     //........
 * }
 * ```
 *
 * @property options.abortCtrl (optional) if not provided `AbortController` will be instantiated when `timeout` used.
 * @property options.headers (optional) request headers. Default: `{ 'content-type' : 'application/json'}`
 * @property options.interceptors (optional) request interceptor callbacks.  See {@link FetchInterceptors} for details.
 * @property options.method (optional) Default: `"get"`
 * @property options.timeout (optional) duration in milliseconds to abort the request if it takes longer.
 * @property options.parse (optional) specify how to parse the result.
 * Default: {@link FetchAs.json}
 * For raw `Response` use {@link FetchAs.response}
 *
 * @example Drop-in replacement for built-in `fetch`
 * ```typescript
 * import fetch from '@superutils/fetch'
 *
 * fetch('https://dummyjson.com/products/1')
 *     .then(response => response.json())
 *     .then(console.log, console.error)
 * ```
 *
 * @example Method specific function with JSON parsing by default
 * ```typescript
 * import fetch from '@superutils/fetch'
 *
 * // no need for `response.json()` or `result.data.data` drilling
 * fetch.get('https://dummyjson.com/products/1')
 *     .then(product => console.log(product))
 * fetch.get('https://dummyjson.com/products/1')
 *     .then(product => console.log(product))
 *
 *
 * fetch.post('https://dummyjson.com/products/add', { title: 'Product title' })
 *     .then(product => console.log(product))
 * ```
 */
const fetchDefault = fetchResponse as FetchWithMethods
// Makes sure defaults are synced with `fetchOriginal.defaults`
Object.defineProperty(fetchDefault, 'defaults', {
	get() {
		return fetchOriginal.defaults
	},
	set(newDefaults: typeof fetchOriginal.defaults) {
		fetchOriginal.defaults = newDefaults
	},
})
fetchDefault.delete = _delete
fetchDefault.get = _get
fetchDefault.head = _head
fetchDefault.options = _options
fetchDefault.patch = _patch
fetchDefault.post = _post
fetchDefault.put = _put

export default fetchDefault
