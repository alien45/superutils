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
 * @example
 * #### Intercept fetch errors to log errors
 * ```javascript
 * import fetch from '@superutils/fetch'
 *
 * // not returning anything or returning undefined will avoid transforming the error.
 * const logError = fetchErr => console.log(fetchErr)
 * const result = await fetch.get('[DUMMYJSON-DOT-COM]/http/400', {
 *   interceptors: {
 *     error: [logError]
 *   }
 * })
 * ```
 *
 * @example
 * #### Intercept & transform fetch errors
 * ```javascript
 * import fetch from '@superutils/fetch'
 *
 * // Interceptors can be async functions or just return a promise that resolves to the error.
 * // If the execution of the interceptor fails or promise rejects, it will be ignored.
 * // To transform the error it must directly return an error or a Promise that `resolves` with an error.
 * const transformError = async (fetchErr, url, options) => {
 *   fetchErr.message = 'Custom errormessage'
 * 	 return Promise.resolve(fetchErr)
 * }
 * const result = await fetch.get('[DUMMYJSON-DOT-COM]/http/400', {
 *   interceptors: {
 *     error: [transformError]
 *   }
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
 * @example
 * #### Intercept and transform fetch request
 * ```typescript
 * import fetch from '@superutils/fetch'
 *
 * // update API version number
 * const apiV1ToV2 = url => `${url}`.replace('api/v1', 'api/v2')
 * const includeAuthToken = (url, options) => {
 *   options.headers.set('x-auth-token', 'my-auth-token')
 * }
 * const result = await fetch.get('[DUMMYJSON-DOT-COM]/products', {
 *   method: 'post',
 *   interceptors: {
 *       result: [apiV1ToV2, includeAuthToken]
 *   }
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
 * @example
 * #### Intercept and transform response:
 * ```javascript
 * import fetch from '@superutils/fetch'
 *
 * // After successful login, retrieve full user details.
 * // This is probably better suited as a result transformer but play along as this is
 * // just a hypothetical scenario ;)
 * const getUser = async response => {
 * 	 const authResult = await response.json()
 *   const userDetails = await fetch.get('[DUMMYJSON-DOT-COM]/users/1')
 *   const userAuth = { ...userDetails, ...authResult }
 *   return new Response(JSON.stringify(userAuth))
 * }
 * const user = await fetch.post(
 * 	'[DUMMYJSON-DOT-COM]/user/login',
 *  {  // data/request body
 *    username: 'emilys',
 *    password: 'emilyspass',
 *    expiresInMins: 30,
 *  },
 *  { interceptors: { response: [getUser] } }
 * )
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
 * @example
 * #### Intercept and transform fetch result
 * ```javascript
 * import fetch from '@superutils/fetch'
 *
 * // first transform result (user object) and ensure user result alwasy contain a hexadecimal crypto balance
 * const ensureBalanceHex = (user = {}) => {
 *   user.crypto ??= {}
 *   user.crypto.balance ??= '0x0'
 *   return user
 * }
 * // then check convert hexadecimal number to BigInt
 * const hexToBigInt = user => {
 *   user.crypto.balance = BigInt(user.crypto.balance)
 *   return user
 * }
 * // then log balance (no transformation)
 * const logBalance = (result, url) => {
 *   // only log balance for single user requests
 *   const shouldLog = result?.hasOwnProperty('crypto') && /^[0-9]+$/.test(
 *     url?.split('/users/')[1].replace('/', '')
 *   )
 *   shouldLog && console.log(
 *     new Date().toISOString(),
 *     '[UserBalance] UserID:', result.id,
 *     result.crypto.balance
 *   )
 * }
 * // now we make the actaul fetch request
 * const result = await fetch.get('[DUMMYJSON-DOT-COM]/users/1', {
 *   interceptors: {
 *     result: [
 * 	     ensureBalanceHex,
 * 	     hexToBigInt,
 * 	     logBalance
 * 	   ]
 *   }
 * })
 * console.log({result})
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
	error?: FetchInterceptorError | FetchInterceptorError[]
	/** Request request interceptors/transformers. See {@link FetchInterceptorRequest} for more details. */
	request?: FetchInterceptorRequest | FetchInterceptorRequest[]
	/** Request response interceptors/transformers. See {@link FetchInterceptorResponse} for more details. */
	response?: FetchInterceptorResponse | FetchInterceptorResponse[]
	/** Request result interceptors/transformers. See {@link FetchInterceptorResult} for more details. */
	result?: FetchInterceptorResult | FetchInterceptorResult[]
}
/** Interceptors after merging should only be array of functions  */
export type FetchInterceptorsMerged = {
	error: FetchInterceptorError[]
	request: FetchInterceptorRequest[]
	response: FetchInterceptorResponse[]
	result: FetchInterceptorResult[]
}
