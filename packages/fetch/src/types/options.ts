import type {
	RetryIfFunc,
	RetryOptions,
	TimeoutOptions,
} from '@superutils/promise'
import { FetchAs } from './constants'
import type { FetchInterceptors, FetchInterceptorsMerged } from './interceptors'
import { DropFirst } from '@superutils/core'

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

export type ExtractFetchAs<T, TFallback = FetchAs.json> = T extends FetchAs
	? T
	: T extends { as: infer As }
		? As extends FetchAs
			? As
			: TFallback
		: TFallback

export type FetchArgs = [url: string | URL, options?: FetchOptions]

export type FetchArgsInterceptor = [
	url: string | URL,
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
	body?: PostBody | (() => PostBody)
	/**
	 * Custom fetch function to use instead of the global `fetch`.
	 * Useful for testing or using a different fetch implementation (e.g. `node-fetch` in older Node versions).
	 *
	 * Default: `globalThis.fetch`
	 */
	fetchFunc?: FetchFunc
	errMsgs?: FetchErrMsgs
	/**
	 * Interceptor/transformer callback executed at different stages of the request.
	 * See {@link FetchInterceptors} for more details.
	 */
	interceptors?: FetchInterceptors
	// /** Request timeout in milliseconds */
	// timeout?: number
	/** Whether to validate URL before making the request. Default: `true` */
	validateUrl?: boolean
} & FetchRetryOptions
	& TimeoutOptions<[]>

/** Default args */
export type FetchDeferredArgs = [
	url?: string | URL,
	options?: Omit<FetchOptions, 'abortCtrl'>,
]

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

export type FetchFunc = (...args: FetchArgs) => Promise<Response>

/**
 * Fetch request options
 */
export type FetchOptions = Omit<RequestInit, 'body'> & FetchCustomOptions

/** Default fetch options */
export type FetchOptionsDefault = Omit<
	FetchOptionsInterceptor,
	'abortCtrl' | 'as' | 'method' | 'signal' | 'timeout'
> & {
	/** Request timeout duration in milliseconds. Default: `30_000` (30 seconds) */
	timeout: number
}

/**
 * Fetch options available to interceptors.
 *
 */
export type FetchOptionsInterceptor = Omit<
	FetchOptions,
	| 'as'
	| 'errMsgs'
	| 'interceptors'
	| 'headers'
	| 'timeout'
	| keyof FetchRetryOptions
> & {
	as: FetchAs
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
	retryIf?: RetryIfFunc<Response>
}

export type PostBody = Record<string, unknown> | BodyInit | null

export type PostArgs = [
	url: string | URL,
	data?: PostBody | (() => PostBody),
	options?: PostOptions,
]

/**
 * Dynamic arguments for deferred post-like methods.
 *
 * @example
 * ```typescript
 * import fetch, { type PostDeferredCbArgs } from '@superutils/fetch'
 *
 * // test with types
 * type T1 = PostDeferredCbArgs<string | URL, undefined> // expected: [data, options]
 * type T2 = PostDeferredCbArgs<undefined, string> // expected: [url, options]
 * type T3 = PostDeferredCbArgs // expected: [url, data, options]
 * type T4 = PostDeferredCbArgs<string, string> // expected: [options]
 *
 * const data = { name: 'test' }
 * const url = 'https://domain.com'
 * // test with fetch.post.deferred()
 * const f1 = fetch.post.deferred({}, 'https://domain.com')
 * // expected: [data, options]
 * f1({data: 1}).then(console.log, console.warn)
 *
 * const f2 = fetch.post.deferred({}, undefined, 'dome data')
 * // expected: [url, options]
 * f2('https').then(console.log, console.warn)
 *
 * const f3 = fetch.post.deferred({})
 * // expected: [url, data, options]
 * f3('https://domain.com').then(console.log, console.warn)
 *
 * const f4 = fetch.post.deferred({}, 'url', 'data')
 * // expected: [options]
 * f4().then(console.log, console.warn)
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
