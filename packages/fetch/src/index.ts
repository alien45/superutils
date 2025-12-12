export * from './fetch'
export * from './fetchDeferred'
export * from './postDeferred'
export * from './mergeFetchOptions'
export * from './post'
export * from './types'
import fetchOriginal from './fetch'
import fetchDeferred from './fetchDeferred'
import post from './post'
import postDeferred from './postDeferred'
import {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	FetchInterceptors,
	FetchOptions,
	PostBody,
	PostOptions,
} from './types'
import { isObj } from '@superutils/core'

export type FetchWithoutMethods = typeof fetchOriginal

/** Describes method-specific fetch-functions that includes `.deferred()` function for deferred/throttled requests */
export type FetchMethodFunc = (<
	T,
	Options extends Omit<FetchOptions, 'method'>,
>(
	url: string | URL,
	options?: Options,
) => ReturnType<typeof fetchOriginal<T, Options>>) & {
	deferred: typeof fetchDeferred
}
/** Describes method-specific fetch-functions that includes `.deferred()` function for deferred/throttled requests */
export type PostMethodFunc = (<T, Options extends Omit<FetchOptions, 'method'>>(
	url: string | URL,
	data?: PostBody,
	options?: Options,
) => ReturnType<typeof fetchOriginal<T, Options>>) & {
	deferred: typeof postDeferred
}
export interface FetchWithMethods extends FetchWithoutMethods {
	get: FetchMethodFunc
	head: FetchMethodFunc
	options: FetchMethodFunc
	delete: PostMethodFunc
	patch: PostMethodFunc
	post: PostMethodFunc
	put: PostMethodFunc
}

/** Create a method-specific fetch function attached with a `.deferred()` function */
const createFetchMethodFunc = (method = 'get') => {
	const methodFunc = (<T>(
		url: string | URL,
		options?: Omit<FetchOptions, 'method'>,
	) => {
		const _options: FetchOptions = isObj(options) ? options : {}
		_options.method = method
		return fetchOriginal<T, FetchOptions>(url, _options)
	}) as FetchMethodFunc
	/** Make debounced/throttled request */
	methodFunc.deferred = (<
		ThisArg,
		Delay extends number,
		GlobalUrl extends string | URL,
	>(
		...args: Parameters<typeof fetchDeferred<ThisArg, Delay, GlobalUrl>>
	) => fetchDeferred(...args)) as typeof fetchDeferred

	return methodFunc
}

/** Create a method-specific function that uses/allows "options.body" attached with a `.deferred()` function */
const createPostMethodFunc = (
	method: Pick<PostOptions, 'method'>['method'] = 'post',
) => {
	const methodFunc = ((
		url: string | URL,
		data?: PostBody,
		options?: Omit<PostOptions, 'method'>,
	) => {
		const _options: PostOptions = isObj(options) ? options : {}
		_options.method = method
		return post(url, data, _options)
	}) as PostMethodFunc
	/** Make debounced/throttled request */
	methodFunc.deferred = (<
		ThisArg,
		Delay extends number,
		DefaultUrl extends string | URL,
	>(
		...args: Parameters<typeof postDeferred<ThisArg, Delay, DefaultUrl>>
	) => postDeferred(...args)) as typeof postDeferred

	return methodFunc
}

/**
 * @function fetch
 *
 * A `fetch()` replacement that simplifies data fetching with automatic JSON parsing, request timeouts, retries,
 * and powerful interceptors. It also includes deferred and throttled request capabilities for complex asynchronous
 * control flows.
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
 * @param options (optional) all built-in `fetch()` options such as "method", "headers" and the additionals below.
 *
 * Options' default values (excluding `method` and `retryIf`) can be configured to be EFFECTIVE GLOBALLY.
 *
 * ```typescript
 * fetch.defaults = {
 *     as: FetchAs.json,
 *     errMsgs: {
 *        invalidUrl: 'Invalid URL',
 *        parseFailed: 'Failed to parse response as',
 *        reqTimedout: 'Request timed out',
 *        requestFailed: 'Request failed with status code:',
 *     },
 *     headers: new Headers([['content-type', 'application/json']]),
 *     interceptors: {
 *     	   error: [],
 *     	   request: [],
 *     	   response: [],
 *     	   result: [],
 *     },
 *     timeout: 0,
 *     ........
 * }
 * ```
 * @param options.abortCtrl (optional) if not provided `AbortController` will be instantiated when `timeout` used.
 * @param options.headers (optional) request headers. Default: `{ 'content-type' : 'application/json'}`
 * @param options.interceptors (optional) request interceptor callbacks.  See {@link FetchInterceptors} for details.
 * @param options.method  (optional) Default: `"get"`
 * @param options.timeout (optional) duration in milliseconds to abort the request if it takes longer.
 * @param options.parse   (optional) specify how to parse the result.
 * Default: {@link FetchAs.json}
 * For raw `Response` use {@link FetchAs.response}
 *
 * @example Make a simple HTTP requests
 * ```typescript
 * import { fetch } from '@superutils/fetch'
 *
 * // no need for `response.json()` or `result.data.theActualData` drilling
 * fetch('https://dummyjson.com/products/1').then(theActualData => console.log(theActualData))
 * ```
 */
export const fetch = fetchOriginal as FetchWithMethods
fetch.get = createFetchMethodFunc('get')
fetch.head = createFetchMethodFunc('head')
fetch.options = createFetchMethodFunc('options')
// Post-like methods that allow `options.body`
fetch.delete = createPostMethodFunc('delete')
fetch.patch = createPostMethodFunc('patch')
fetch.post = createPostMethodFunc('post')
fetch.put = createPostMethodFunc('put')
export default fetch
