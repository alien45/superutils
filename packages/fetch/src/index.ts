/* eslint-disable @typescript-eslint/no-unused-vars */

// Re-export fetch relevant & useful things from '@superutils/promise' for ease of use
export {
	ResolveError,
	ResolveIgnored,
	TIMEOUT_FALLBACK,
	TIMEOUT_MAX,
	TimeoutPromise,
} from '@superutils/promise'
export type {
	DeferredAsyncOptions,
	OnEarlyFinalize,
	OnFinalize,
	RetryIfFunc,
	RetryOptions,
	TimeoutOptions,
} from '@superutils/promise'

/* All local exports */
export * from './createClient'
export * from './createPostClient'
export * from './executeInterceptors'
export * from './fetch'
export * from './getResponse'
export * from './mergeOptions'
export * from './types'
import createClient from './createClient'
import createPostClient from './createPostClient'
import _fetch from './fetch'
import { FetchAs, FetchCustomOptions, FetchInterceptors } from './types'

const methods = {
	/** Make HTTP requests with method GET */
	get: createClient({ method: 'get' }),

	/** Make HTTP requests with method HEAD */
	head: createClient({ method: 'head' }),

	/** Make HTTP requests with method OPTIONS */
	options: createClient({ method: 'options' }),

	/** Make HTTP requests with method DELETE */
	delete: createPostClient({ method: 'delete' }),

	/** Make HTTP requests with method PATCH */
	patch: createPostClient({ method: 'patch' }),

	/** Make HTTP requests with method POST */
	post: createPostClient({ method: 'post' }),

	/** Make HTTP requests with method PUT */
	put: createPostClient({ method: 'put' }),
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
 *
 * @param url
 * @param options (optional) Standard `fetch` options extended with {@link FetchCustomOptions}
 * @param options.abortCtrl (optional) if not provided `AbortController` will be instantiated when `timeout` used.
 *
 * Default: `new AbortController()`
 * @param options.as (optional) (optional) specify how to parse the result.
 * For raw `Response` use {@link FetchAs.response}
 *
 * Default: {@link FetchAs.json}
 * @param options.headers (optional) request headers
 *
 * Default: `{ 'content-type': 'application/json' }`
 * @param options.interceptors (optional) request interceptor/transformer callbacks.
 * See {@link FetchInterceptors} for details.
 * @param options.method (optional) fetch method.
 *
 * Default: `'get'`
 * @param options.timeout (optional) duration in milliseconds to abort the request.
 * This duration includes the execution of all interceptors/transformers.
 *
 * Default: `30_000`
 *
 *
 *
 * ---
 *
 * @example
 * #### Drop-in replacement for built-in fetch
 *
 * ```javascript
 * import fetch from '@superutils/fetch'
 *
 * fetch('https://dummyjson.com/products/1')
 *   .then(response => response.json())
 *   .then(console.log, console.error)
 * ```
 *
 * @example
 * #### Method specific function with JSON parsing by default
 * ```javascript
 * import fetch from '@superutils/fetch'
 *
 * // no need for `response.json()` or `result.data.data` drilling
 * fetch.get('https://dummyjson.com/products/1')
 *   .then(product => console.log(product))
 * fetch.post('https://dummyjson.com/products/add', { title: 'Product title' })
 *   .then(product => console.log(product))
 * ```
 *
 *
 * @example
 * #### Set default options.
 *
 * Options' default values (excluding `as` and `method`) can be configured to be EFFECTIVE GLOBALLY.
 *
 * ```typescript
 * import fetch from '@superutils/fetch'
 *
 * const { defaults, errorMsgs, interceptors } = fetch
 *
 * // set default request timeout duration in milliseconds
 * defaults.timeout = 40_000
 *
 * // default headers
 * defaults.headers = { 'content-type': 'text/plain' }
 *
 * // override error messages
 * errorMsgs.invalidUrl = 'URL is not valid'
 * errorMsgs.timedout = 'Request took longer than expected'
 *
 * // add an interceptor to log all request failures.
 * const fetchLogger = (fetchErr, url, options) => console.log('Fetch error log', fetchErr)
 * interceptors.error.push(fetchLogger)
 *
 * // add an interceptor to conditionally include header before making requests
 * interceptors.request.push((url, options) => {
 *   // ignore login requests
 *   if (`${url}`.includes('/login')) return
 *
 *   options.headers.set('x-auth-token', 'my-auth-token')
 * })
 * ```
 */
export const fetch = _fetch as typeof _fetch & typeof methods
fetch.delete = methods.delete
fetch.get = methods.get
fetch.head = methods.head
fetch.options = methods.options
fetch.patch = methods.patch
fetch.post = methods.post
fetch.put = methods.put

export default fetch
