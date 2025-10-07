import { ValueOrPromise } from '@utiils/core'

export type FetchArgs = [url: string | URL, options?: FetchOptions]

export type FetchArgsInterceptor = [
	url: string | URL,
	options: FetchOptionsInterceptor,
]

export enum FetchAs {
	arrayBuffer = 'arrayBuffer',
	blob = 'blob',
	formData = 'formData',
	json = 'json',
	response = 'response',
	text = 'text',
}

export type FetchConf = {
	/** Default: 'json' */
	as?: FetchAs
	abortCtrl?: AbortController
	errMsgs?: FetchErrMsgs
	interceptors?: FetchInterceptors
	/** Request timeout in milliseconds. */
	timeout?: number
}

export type FetchInterceptors = {
	error?: Array<Interceptor<FetchError, FetchArgsInterceptor>>
	request?: Array<Interceptor<FetchArgs[0], FetchArgsInterceptor>>
	response?: Array<Interceptor<Response, FetchArgsInterceptor>>
	result?: Array<Interceptor<unknown, FetchArgsInterceptor>>
}

/** Default args */
export type FetchDeferredArgs = [
	url?: string | URL,
	options?: Omit<FetchOptions, 'abortCtrl'>,
]

export type FetchErrMsgs = {
	invalidUrl?: string
	parseFailed?: string
	reqTimedout?: string
	requestFailed?: string
}

export class FetchError extends Error {
	options?: FetchOptions
	response?: Response
	url: string | URL

	constructor(
		message: string,
		options: {
			cause?: unknown
			options?: FetchOptions
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
}

export type FetchOptions = RequestInit & FetchConf & FetchRetryConf

export type FetchOptionsInterceptor = Omit<
	FetchOptions,
	'as' | 'errMsgs' | 'interceptors' | 'headers' | keyof FetchRetryConf
> & {
	as: FetchAs
	errMsgs: Required<FetchErrMsgs>
	headers: Headers
	interceptors: Required<FetchInterceptors>
} & Required<FetchRetryConf>

export interface FetchResult<T> {
	arrayBuffer: ArrayBuffer
	blob: Blob
	formData: FormData
	json: T
	text: string
	response: Response
}

export type FetchRetryConf = {
	/** Default: 0 */
	retry?: number
	retryDelayMs?: number
	/**
	 * Accepted values:
	 * - exponential: each subsequent retry delay will be doubled from the last
	 * - linear: fixed delay between retries
	 * Default: 'exponential'
	 */
	retryBackOff?: 'exponential' | 'linear'
	/**
	 * Add random delay between 0ms and 100ms to the retry delay
	 * Default: true
	 */
	retryDelayJitter?: boolean
}

export type Interceptor<
	T,
	TArgs extends any[],
	TArgs2 extends any[] = [value: T, ...TArgs],
> = (...args: TArgs2) => ValueOrPromise<void> | ValueOrPromise<T>

export type PostBody = Record<string, unknown> | BodyInit | null

export type PostArgs = [
	url: string | URL,
	data?: PostBody,
	options?: Omit<FetchOptions, 'method'>,
]

/** Default args for `PromisE.deferredPost()`*/
export type PostDeferredArgs = [
	url?: string | URL,
	data?: PostBody,
	options?: Omit<FetchOptions, 'method' | 'abortCtrl'>,
]
