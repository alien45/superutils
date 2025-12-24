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
	FetchArgs,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	FetchInterceptors,
	FetchOptions,
	PostArgs,
	PostDeferredCbArgs,
	PostOptions,
} from './types'

/** Create a method-specific fetch function attached with a `.deferred()` function */
export const createFetchMethodFunc = (method = 'get') => {
	const methodFunc = <T>(
		url: string | URL,
		options?: Omit<FetchOptions, 'method'>,
	) => {
		options ??= {}
		;(options as FetchOptions).method = method
		return fetchOriginal<T, FetchOptions>(url, options)
	}

	/** Make debounced/throttled request */
	methodFunc.deferred = <
		ThisArg = unknown,
		Delay extends number = number,
		GlobalUrl = FetchArgs[0] | undefined,
		CbArgs extends unknown[] = undefined extends GlobalUrl
			? FetchArgs<true> // true: deny callback overriding 'method' in options
			: [options?: FetchArgs<true>[1]],
	>(
		...args: Parameters<
			typeof fetchDeferred<ThisArg, Delay, GlobalUrl, CbArgs>
		>
	) => {
		args[2] ??= {}
		args[2].method = method
		return fetchDeferred(...args)
	}

	return methodFunc
}

/** Create a method-specific function for POST-like methods and with a `.deferred()` function */
export const createPostMethodFunc = (
	method: Pick<PostOptions, 'method'>['method'] = 'post',
) => {
	const methodFunc = <T, Args extends PostArgs<true> = PostArgs<true>>(
		url: Args[0],
		data?: Args[1],
		options?: Args[2],
	) => {
		options ??= {}
		;(options as PostOptions).method = method
		return post<T>(url, data, options)
	}

	methodFunc.deferred = <
		ThisArg,
		Delay extends number = number,
		GlobalUrl extends PostArgs[0] | undefined = undefined,
		GlobalData extends PostArgs[1] | undefined = undefined,
		// Conditionally define the arguments for the returned function
		CbArgs extends unknown[] = PostDeferredCbArgs<
			GlobalUrl,
			GlobalData,
			true // true: deny callback overriding 'method' in options
		>,
	>(
		...args: Parameters<
			typeof postDeferred<ThisArg, Delay, GlobalUrl, GlobalData, CbArgs>
		>
	) => {
		args[3] ??= {}
		args[3].method = method
		return postDeferred(...args)
	}

	return methodFunc
}
const _get = createFetchMethodFunc('get')
const _head = createFetchMethodFunc('head')
const _options = createFetchMethodFunc('options')
// Post-like methods that allow `options.body`
const _delete = createPostMethodFunc('delete')
const _patch = createPostMethodFunc('patch')
const _post = createPostMethodFunc('post')
const _put = createPostMethodFunc('put')

/**
 * @function fetch
 *
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
 * @param options (optional) all built-in `fetch()` options such as "method", "headers" and the additionals below.
 *
 * Options' default values (excluding `method` and `retryIf`) can be configured to be EFFECTIVE GLOBALLY.
 *
 * ```typescript
 * import fetch from '@superutils/fetch'
 *
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
 * @example Make a simple HTTP requests
 * ```typescript
 * import { fetch } from '@superutils/fetch'
 *
 * // no need for `response.json()` or `result.data.theActualData` drilling
 * fetch('https://dummyjson.com/products/1').then(theActualData => console.log(theActualData))
 * ```
 */
export const fetch = fetchOriginal as typeof fetchOriginal & {
	delete: typeof _delete
	get: typeof _get
	head: typeof _head
	options: typeof _options
	patch: typeof _patch
	post: typeof _post
	put: typeof _put
}
fetch.delete = _delete
fetch.get = _get
fetch.head = _head
fetch.options = _options
fetch.patch = _patch
fetch.post = _post
fetch.put = _put

export default fetch
