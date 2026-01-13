import { ValueOrPromise } from '@superutils/core'
import { type RetryOptions } from '@superutils/promise'

// Export useful types from PromisE for ease of use
export {
	type DeferredAsyncOptions,
	ResolveError,
	ResolveIgnored,
} from '@superutils/promise'

export type ExcludeOptions<
	Target, // options to exclude
	Options extends FetchOptions = FetchOptions,
> = Target extends FetchOptions
	? { headers?: Options['headers'] } & Omit<Options, 'headers' | keyof Target>
			& Partial<Record<Exclude<keyof Target, 'headers'>, never>> // explicitly prevents excluded properties
	: Options

export type ExcludePostOptions<Target> = ExcludeOptions<Target, PostOptions>

export type FetchArgs = [url: string | URL, options?: FetchOptions]

export type FetchArgsInterceptor = [
	url: string | URL,
	options: FetchOptionsInterceptor,
]

export enum FetchAs {
	arrayBuffer = 'arrayBuffer',
	blob = 'blob',
	bytes = 'bytes',
	formData = 'formData',
	json = 'json',
	response = 'response',
	text = 'text',
}

/** Extract `FetchAs` from `FetchOptions` */
export type FetchAsFromOptions<
	TOptions,
	TFallback = FetchAs.json,
> = TOptions extends {
	as: infer As
}
	? As extends FetchAs
		? As
		: TFallback
	: TFallback

/** Custom fetch options (not used by built-in `fetch()`*/
export type FetchCustomOptions = {
	/**
	 * Specify how the parse the result. To get raw response use {@link FetchAs.response}.
	 * Default: 'json'
	 */
	as?: FetchAs
	abortCtrl?: AbortController
	body?: PostBody | (() => PostBody)
	errMsgs?: FetchErrMsgs
	interceptors?: FetchInterceptors
	/** Request timeout in milliseconds. */
	timeout?: number
	validateUrl?: boolean
} & FetchRetryOptions

/** Default args */
export type FetchDeferredArgs<OmitMethod extends boolean = false> = [
	url?: string | URL,
	options?: Omit<
		FetchOptions,
		'abortCtrl' | (OmitMethod extends true ? 'method' : never)
	>,
]

export type FetchErrMsgs = {
	invalidUrl?: string
	parseFailed?: string
	reqTimedout?: string
	requestFailed?: string
}

/** Custom error message for fetch requests with more detailed info about the request URL, fetch options and response */
export class FetchError extends Error {
	options: FetchOptions
	response?: Response
	url: string | URL

	constructor(
		message: string,
		options: {
			cause?: unknown
			options: FetchOptions
			response?: Response
			url: string | URL
		},
	) {
		super(message, { cause: options.cause })
		this.name = 'FetchError'
		this.options = options.options
		this.response = options.response
		this.url = options.url
	}

	clone = (newMessage: string) =>
		new FetchError(newMessage, {
			cause: this.cause,
			options: this.options,
			response: this.response,
			url: this.url,
		})
}

/**
 * Fetch error interceptor to be invoked whenever an exception occurs.
 * This interceptor can also be used as the error transformer by returning {@link FetchError}.
 *
 * @param	{FetchError}	fetchError custom error that also contain URL, options & response
 *
 * @returns returning undefined or not returning anything will not override the error
 *
 * @example	intercept fetch errors to log errors
 * ```typescript
 * import PromisE from '@superutils/promise'
 *
 * // not returning anything or returning undefined will avoid transforming the error.
 * const logError = fetchErr => console.log(fetchErr)
 * const result = await PromisE.fetch('https://my.domain.com/api/that/fails', {
 *     interceptors: {
 *         error: [logError]
 *     }
 * })
 * ```
 *
 * @example	intercept & transform fetch errors
 * ```typescript
 * import PromisE from '@superutils/promise'
 *
 * // Interceptors can be async functions or just return a promise that resolves to the error.
 * // If the execution of the interceptor fails or promise rejects, it will be ignored.
 * // To transform the error it must directly return an error or a Promise that `resolves` with an error.
 * const transformError = async (fetchErr, url, options) => {
 *     fetchErr.message = 'Custom errormessage'
 * 	   return Promise.resolve(fetchErr)
 * }
 * const result = await PromisE.fetch('https://my.domain.com/api/that/fails', {
 *     interceptors: {
 *         error: [transformError]
 *     }
 * })
 * ```
 */
export type FetchInterceptorError = Interceptor<
	FetchError,
	FetchArgsInterceptor
>

/**
 * Fetch request interceptor to be invoked before making a fetch request.
 * This interceptor can also be used as a transformer:
 * 1. by returning an API URL (string/URL)
 * 2. by modifying the properties of the options parameter to be used before making the fetch request
 *
 * @example intercept and transform fetch request
 * ```typescript
 * import PromisE from '@superutils/promise'
 *
 * // update API version number
 * const apiV1ToV2 = url => `${url}`.replace('api/v1', 'api/v2')
 * const includeAuthToken = (url, options) => {
 *     options.headers.set('x-auth-token', 'my-auth-token')
 * }
 * const data = await PromisE.fetch('https://my.domain.com/api', {
 *     interceptors: {
 *         result: [apiV1ToV2, includeAuthToken]
 *     }
 * })
 * ```
 */
export type FetchInterceptorRequest = Interceptor<
	FetchArgs[0],
	[FetchArgsInterceptor[1]]
>

/**
 * Fetch response interceptor to be invoked before making a fetch request.
 *
 * This interceptor can also be used as a transformer by return a different/modified {@link Response}.
 *
 * @example intercept and transform response:
 * ```typescript
 * import PromisE from '@superutils/promise'
 *
 * // After successful login, retrieve user balance.
 * // This is probably better suited as a result transformer but play along as this is
 * // just a hypothetical scenario ;)
 * const includeBalance = async response => {
 *     const balance = await PromisE.fetch('https://my.domain.com/api/user/12325345/balance')
 * 	   const user = await response.json()
 *     user.balance = balance
 *     return new Response(JSON.stringify(user))
 * }
 * const user = await PromisE.fetch('https://my.domain.com/api/login', {
 *     interceptors: {
 *         response: [includeBalance]
 *     }
 * })
 * ```
 */
export type FetchInterceptorResponse = Interceptor<
	Response,
	FetchArgsInterceptor
>

/**
 *
 * Fetch result interceptor to be invoked before returning parsed fetch result.
 *
 * Result interceptors are executed ONLY when a result is successfully parsed (as ArrayBuffer, Blob, JSON, Text...).
 * Result interceptors WILL NOT be executed if:
 * - return type is set to `Response` by using {@link FetchAs.response} in the {@link FetchOptions.as}
 * - exceptions is thrown even before attempting to parse
 * - parse fails
 *
 * This interceptor can also be used as a transformer by returns a different/modified result.
 *
 *
 * @example intercept and transform fetch result
 * ```typescript
 * import PromisE from '@superutils/promise'
 *
 * // first transform result by extracting result.data
 * const extractData = result => result?.data ?? result
 * // then check convert hexadecimal number to BigInt
 * const hexToBigInt = data => {
 *     if (data.hasOwnProperty('balance') && `${data.balance}`.startsWith('0x')) {
 *          data.balance = BigInt(data.balance)
 *     }
 *     return data
 * }
 * // then log balance (no transformation)
 * const logBalance = data => {
 *     data?.hasOwnProperty('balance') && console.log(data.balance)
 * }
 * const data = await PromisE.fetch('https://my.domain.com/api', {
 *     interceptors: {
 *         result: [
 * 	           extractData,
 * 	           hexToBigInt,
 * 	           logBalance
 * 	       ]
 *     }
 * })
 * ```
 */
export type FetchInterceptorResult<
	Args extends unknown[] = FetchArgsInterceptor,
> = Interceptor<unknown, Args>

/**
 * All valid interceptors for fetch requests are:
 * ---
 * 1. error,
 * 2. request
 * 3. response
 * 4. result.
 *
 * An interceptor can be any of the following:
 * ---
 * 1. synchronous function
 * 2. synchronous function that returns a promise (or sometimes returns a promise)
 * 3. asynchronous functions
 *
 * An interceptor can return:
 * ---
 * 1. undefined (void/no return): plain interceptor that does other stuff but does not transform
 * 2. value: act as a transformer. Returned value depends on the type of interceptor.
 * 3. promise resolves with (1) value or (2) undefined
 *
 * PS:
 * ---
 * 1. Any exception thrown by interceptors will gracefully ignored.
 * 2. Interceptors will be executed in the sequence they're given.
 * 3. Execution priority: global interceptors will always be executed before local interceptors.
 *
 *
 *
 * More info & examples:
 * ---
 * See the following for more details and examples:
 *
 * - `error`: {@link FetchInterceptorError}
 * - `request`: {@link FetchInterceptorRequest}
 * - `response`: {@link FetchInterceptorResponse}
 * - `result`: {@link FetchInterceptorResult}
 */
export type FetchInterceptors = {
	error?: FetchInterceptorError[]
	request?: FetchInterceptorRequest[]
	response?: FetchInterceptorResponse[]
	result?: FetchInterceptorResult[]
}

/**
 * Fetch request options
 */
export type FetchOptions = Omit<RequestInit, 'body'> & FetchCustomOptions

export type FetchOptionsDefaults = Omit<
	FetchOptionsInterceptor,
	'as' | 'method' | 'retryIf'
>

/**
 * Fetch options available to interceptors
 */
export type FetchOptionsInterceptor = Omit<
	FetchOptions,
	'as' | 'errMsgs' | 'interceptors' | 'headers' | keyof FetchRetryOptions
> & {
	as: FetchAs
	errMsgs: Required<FetchErrMsgs>
	headers: Headers
	interceptors: Required<FetchInterceptors>
} & FetchRetryOptions

/**
 * Result types for specific parsers ("as": FetchAs)
 */
export type FetchResult<T> = {
	arrayBuffer: ArrayBuffer
	blob: Blob
	bytes: Uint8Array<ArrayBuffer>
	formData: FormData
	json: T
	text: string
	response: Response
}

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
	retryIf?:
		| null
		| ((
				response: Response | undefined,
				retryCount: number,
				error?: unknown,
		  ) => boolean | Promise<boolean>)
}

/**
 * Generic fetch interceptor type
 */
export type Interceptor<T, TArgs extends unknown[]> = (
	...args: [value: T, ...TArgs]
) => ValueOrPromise<void> | ValueOrPromise<T>

export type PostBody = Record<string, unknown> | BodyInit | null

export type PostArgs<OmitMethod = false> = [
	url: string | URL,
	data?: PostBody | (() => PostBody),
	options?: OmitMethod extends true
		? Omit<FetchOptions, 'method'>
		: PostOptions,
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
	TUrl = undefined,
	TData = undefined,
	Options = PostOptions,
	CbArgsReq extends unknown[] = Required<PostArgs>,
> = [TUrl, TData] extends [CbArgsReq[0], undefined] // only URL provided
	? [data?: PostArgs[1], options?: Options]
	: [TUrl, TData] extends [undefined, CbArgsReq[1]] // only data provided
		? [url: PostArgs[0], options?: Options]
		: [TUrl, TData] extends [CbArgsReq[0], CbArgsReq[1]]
			? [options?: Options] // Both default URL and data are provided
			: PostArgs

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
