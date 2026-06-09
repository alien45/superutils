import { DropFirst, ValueOrPromise } from '@superutils/core'
import type {
	RetryIfFunc,
	RetryOptions,
	TimeoutOptions,
} from '@superutils/promise'
import { FetchAs } from './constants'
import type { FetchInterceptors, FetchInterceptorsMerged } from './interceptors'

/** Exclude properties of `Target` from `Options`. `headers` will always be included */
export type ExcludeOptions<
	Target,
	Options extends FetchOptions = FetchOptions,
> = Target extends FetchOptions
	? { headers?: Options['headers'] } & Omit<Options, 'headers' | keyof Target> //always allow headers // exclude props
			& Partial<Record<Exclude<keyof Target, 'headers'>, never>> // explicitly prevents excluded properties
	: Options

/** Exclude properties of `Target` from {@link PostOptions} */
export type ExcludePostOptions<Target> = ExcludeOptions<Target, PostOptions>

/** Extract the first macthing `FetchAs` from `T` array. If none matches, use `Fallback` */
export type ExtractAs<
	T extends unknown[], //FetchOptions/FetchAs/...
	Fallback = FetchAs.json,
> = T['length'] extends 0
	? Fallback
	: T[0] extends FetchAs
		? T[0]
		: T[0] extends { as: infer OptAs } // fetch options
			? OptAs extends FetchAs
				? OptAs
				: ExtractAs<DropFirst<T>, Fallback>
			: ExtractAs<DropFirst<T>, Fallback>

export type FetchArgs = [
	url: string | URL | RequestInfo,
	options?: FetchOptions,
]

/** Additional arguments provided to interceptors */
export type FetchArgsInterceptor = [
	url: FetchArgs[0],
	options: FetchOptionsInterceptor,
]

/** Custom fetch options (not used by built-in `fetch()`*/
export type FetchCustomOptions = {
	/**
	 * Specify how the parse the result. To get raw response use {@link FetchAs.response}.
	 * Default: 'json'
	 */
	as?: FetchAs

	/**
	 * An `AbortController` instance to control the request.
	 *
	 * If not provided, a new instance is automatically created internally.
	 *
	 * It is supported in addition to the standard `signal`. If both are provided, `abortCtrl` will be aborted
	 * when the `signal` aborts or when the request times out.
	 *
	 * Recommendation:
	 * - For request timeout purposes, setting a timeout duration will be sufficient.
	 * Abort controller/signal is not needed.
	 * - Use `abortCtrl` instead of `signal` to prevent creating internal `AbortController` instance.
	 */
	abortCtrl?: AbortController
	body?: PostArgs[1]
	errMsgs?: FetchErrMsgs

	/**
	 * If set to `true`, the global `fetch.defaults` (including global headers, interceptors,
	 * and timeout settings) will not be merged into the options for this request.
	 *
	 * Default: `false`
	 */
	ignoreGlobalDefaults?: boolean

	/**
	 * Custom fetch function to use instead of the global `fetch`.
	 * Useful for testing or using a different fetch implementation (e.g. `node-fetch` in older Node versions).
	 *
	 * Default: `globalThis.fetch`
	 */
	fetchFunc?: FetchFunc

	/**
	 * Interceptor/transformer callback executed at different stages of the request.
	 * See {@link FetchInterceptors} for more details.
	 */
	interceptors?: FetchInterceptors

	onDownloadProgress?: OnDownloadProgress

	/** Whether to validate URL before making the request. Default: `false` */
	validateUrl?: boolean
} & FetchRetryOptions
	& TimeoutOptions<[]>

export type FetchErrMsgs = {
	/** Error message to be used when request is aborted without specifying a message */
	aborted?: string
	/** Error message to be use when URL validation fails */
	invalidUrl?: string
	/** Error message to be used when request parse failes */
	parseFailed?: string
	/** Error message to be used when request times out */
	timedout?: string
	/** Error message to be used when request fails */
	requestFailed?: string
}

/** Optional, custom fetch function to replace the built-in `fetch` */
export type FetchFunc = (...args: FetchArgs) => Promise<Response>

/**
 * Fetch request options
 */
export type FetchOptions = Omit<RequestInit, 'body'> & FetchCustomOptions

/** Default fetch options */
export type FetchOptionsDefault = Omit<
	FetchOptionsInterceptor,
	| 'abortCtrl'
	| 'as'
	| 'body'
	| 'ignoreGlobalDefaults'
	| 'method'
	| 'signal'
	| 'timeout'
	| 'headers'
> & {
	/**
	 * Request headers.
	 *
	 * Deafult:
	 * - No default content type set when `fetch()` is directly invoked.
	 * - Content type `"application/json"` is used as the default for all `createPostClient()`
	 * derived functions (eg: `fetch.post()`, `fetch.put()`...),
	 */
	headers: HeadersInit
	/**
	 * Request timeout duration in milliseconds.
	 *
	 * Default: `60_000`
	 */
	timeout: number
}

/**
 * Fetch options available to interceptors.
 *
 */
export type FetchOptionsInterceptor = Omit<
	FetchOptions,
	| 'as'
	| 'body'
	| 'errMsgs'
	| 'interceptors'
	| 'headers'
	| 'timeout'
	| keyof FetchRetryOptions
> & {
	as: FetchAs
	body?: PostBody
	/** Error messages */
	errMsgs: Required<FetchErrMsgs>
	headers: Headers
	/** Interceptors/transformers for fetch requests. See {@link FetchInterceptors} for more details. */
	interceptors: FetchInterceptorsMerged
	timeout: number
} & FetchRetryOptions

/**
 * Result types for specific parsers ("as": FetchAs)
 */
export type FetchResult<T = unknown> = {
	arrayBuffer: ArrayBuffer
	blob: Blob
	bytes: Uint8Array<ArrayBuffer>
	formData: FormData
	json: T
	text: string
	response: Response
}

export type GetFetchResult<As = unknown, T = never> = [T] extends [never]
	? FetchResult[As extends unknown[]
			? ExtractAs<As>
			: As extends FetchAs
				? As
				: FetchAs.json]
	: T

/**
 * Fetch retry options
 */
export type FetchRetryOptions = Omit<
	Partial<RetryOptions>,
	'retry' | 'retryIf'
> & {
	/**
	 * Maximum number of retries.
	 *
	 * The total number of attempts will be `retry + 1`.
	 *
	 * Default: `0`
	 */
	retry?: number
	/**
	 * An optional predicate function to determine retry eligibility.
	 * Also useful for side effects like logging or analytics.
	 *
	 * Returning `true` explicitly triggers a retry, while `false` prevents it.
	 * If the function returns `undefined` or `void`, the default library logic is used
	 * (retry if an exception was thrown or if `response.ok` is `false`).
	 *
	 * @param response The Response object from the last attempt, if available.
	 * @param retryCount The current retry attempt number (starting from 1).
	 * @param error The error encountered during the request, if any.
	 *
	 * @returns A boolean indicating whether to retry, or a promise resolving to boolean.
	 *
	 *
	 * @example
	 * #### Example: Retry on specific status codes
	 * ```javascript
	 * import fetch from '@superutils/fetch'
	 *
	 * fetch
	 * 	.get('[DUMMYJSON-DOT-COM]/products/1', {
	 * 		retry: 3, // If request fails, retry up to three more times
	 * 		// Retry on rate limits (429) or transient server errors (5xx).
	 * 		retryIf: r => r.status === 429 || r.status >= 500,
	 * 	})
	 * 	.then(console.log)
	 * ```
	 *
	 * @example
	 * #### Example: Polling (Retry until a condition is met)
	 * Keep retrying every minute until a product is back in stock.
	 * ```javascript
	 * import fetch from '@superutils/fetch'
	 *
	 * fetch
	 * 	.get('[DUMMYJSON-DOT-COM]/products/1', {
	 * 	  delay: 60_000, // Wait 1 minute between attempts
	 * 	  retry: 10, // Attempt up to 10 more times
	 * 	  retryIf: async (response) => {
	 * 	    if (!response?.ok) return true // Retry on network or server errors
	 *
	 * 		// Use response.clone() to avoid consuming the body stream used by the final result.
	 * 		const result = await response.clone().json()
	 *
	 * 		// Retry if the product is still NOT in stock
	 * 		return result?.availabilityStatus !== 'In Stock'
	 * 	  },
	 *
	 *    // Ensure the overall timeout accounts for the polling duration
	 * 	  timeout: 60_000 * 15
	 * 	})
	 * 	.then(product => console.log('Product is back in stock:', product))
	 * ```
	 */
	retryIf?: RetryIfFunc<Response>
}

/**
 * Callback function for monitoring download progress.
 *
 * @param percent The progress percentage (0-100), or `null` if Content-Length is unknown.
 * @param received The total number of bytes received so far.
 * @param total The total number of bytes expected, or `null` if Content-Length is unknown.
 *
 * @example
 * #### Download a file as Blob
 * ```javascript
 * import fetch from '@superutils/fetch'
 *
 * fetch.get(
 *   '[DUMMYJSON-DOT-COM]/image/4000x4000/008080/ffffff?text=Hello+@superutils', // dynamic image file
 *   {
 *     as: FetchAs.blob,
 *     onDownloadProgress: (parcent, received, total) =>
 *     	 console.log({
 *         percent: `${(parcent ?? 0).toFixed(2)}%`,
 *         received,
 *         total,
 *       }),
 *   },
 * ).then(r => console.log('result', r), console.log)
 * ```
 */
export type OnDownloadProgress = (
	percent: number | null,
	received: number,
	total: number | null,
) => ValueOrPromise<void>

/**
 * Possible types for the request body.
 * Can be a plain object (which will be stringified if JSON), standard BodyInit, or null.
 */
export type PostBody = object | Record<string, unknown> | BodyInit | null

export type PostArgs = [
	url: FetchArgs[0],
	/**
	 * Post body or a function that returns/resolves post body.
	 *
	 * PS:
	 * - if function provided, it will be executed before executing any request interceptors
	 * - if function execution fails it will throw an error and avoid making the fetch request
	 */
	data?: PostBody | (() => ValueOrPromise<PostBody>),
	options?: PostOptions,
]

/**
 * Dynamic arguments for deferred post-like methods.
 *
 * @example
 * ```typescript
 * import fetch, { type PostDeferredCbArgs } from '@superutils/fetch'
 *
 * type T1 = PostDeferredCbArgs<string | URL, undefined> // expected: [data, options]
 * type T2 = PostDeferredCbArgs<string | undefined, string> // expected: [url, options]
 * type T3 = PostDeferredCbArgs // expected: [url, data, options]
 * type T4 = PostDeferredCbArgs<string, string> // expected: [options]
 * ```
 */
export type PostDeferredCbArgs<
	DefaultUrl = undefined,
	DefaultData = undefined,
	Options = PostArgs[2],
	PostArgsReq extends unknown[] = Required<PostArgs>,
	// avoid `string | undefined` not matching `undefined`
	_url = undefined extends DefaultUrl ? undefined : DefaultUrl,
	_data = undefined extends DefaultData ? undefined : DefaultData,
> = [_url, _data] extends [PostArgsReq[0], undefined]
	? // only URL provided
		[data?: PostArgs[1], options?: PostArgs[2]]
	: // only data provided
		[_url, _data] extends [undefined, PostArgsReq[1]]
		? [url: PostArgs[0], options?: PostArgs[2]]
		: // Both default URL and data are provided
			[_url, _data] extends [PostArgsReq[0], PostArgsReq[1]]
			? [options?: PostArgs[2]]
			: [url: PostArgs[0], data?: PostArgs[1], options?: Options]

/** Request options for POST-like methods that allow "options.body" */
export type PostOptions = {
	/** Default: `'post'` */
	method?:
		| 'post'
		| 'put'
		| 'patch'
		| 'delete'
		| 'POST'
		| 'PUT'
		| 'PATCH'
		| 'DELETE'
} & Omit<FetchOptions, 'method'>
