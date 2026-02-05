import { ValueOrPromise } from '@superutils/core'
import { FetchError } from './FetchError'
import { FetchArgs, FetchArgsInterceptor } from './options'

/**
 * Generic definition for interceptor and transformer callbacks used throughout the fetch lifecycle.
 */
export type Interceptor<T, TArgs extends unknown[]> = (
	...args: [value: T, ...TArgs]
) => ValueOrPromise<void> | ValueOrPromise<T>

/**
 * Fetch error interceptor to be invoked whenever an exception occurs.
 * This interceptor can also be used as the error transformer by returning {@link FetchError}.
 *
 * Note: The error interceptor is only triggered if the request ultimately fails. If retries are enabled (`retry > 0`)
 * and a subsequent attempt succeeds, this interceptor will not be invoked for the intermediate failures.
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
 * 1. error
 * 2. request
 * 3. response
 * 4. result
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
 * 4. The following options cannot be modified using interceptors: abortCtrl, as, signal, timeout
 *
 * More info about specific interceptor types & examples:
 * ---
 * See the following for more details and examples:
 *
 * - `error`: {@link FetchInterceptorError}
 * - `request`: {@link FetchInterceptorRequest}
 * - `response`: {@link FetchInterceptorResponse}
 * - `result`: {@link FetchInterceptorResult}
 */
export type FetchInterceptors = {
	/** Request error interceptors/transformers. See {@link FetchInterceptorError} for more details. */
	error?: FetchInterceptorError[]
	/** Request request interceptors/transformers. See {@link FetchInterceptorRequest} for more details. */
	request?: FetchInterceptorRequest[]
	/** Request response interceptors/transformers. See {@link FetchInterceptorResponse} for more details. */
	response?: FetchInterceptorResponse[]
	/** Request result interceptors/transformers. See {@link FetchInterceptorResult} for more details. */
	result?: FetchInterceptorResult[]
}
