import { deferredCallback } from '@superutils/promise'
import fetch from './fetch'
import { mergePartialOptions } from './mergeFetchOptions'
import {
	DeferredAsyncOptions,
	ExcludeOptions,
	FetchArgs,
	FetchAs,
	FetchAsFromOptions,
	FetchOptions,
	FetchResult,
} from './types'

/**
 * Create a reusable fetch client with shared options. The returned function comes attached with a
 * `.deferred()` function for debounce and throttle behavior.
 *
 * The `createClient` utility streamlines the creation of dedicated API clients by generating pre-configured fetch
 * functions. These functions can be equipped with default options like headers, timeouts, or a specific HTTP method,
 * which minimizes code repetition across your application. If a method is not specified during creation, the client
 * will default to `GET`.
 *
 * The returned client also includes a `.deferred()` method, providing the same debounce, throttle, and sequential
 * execution capabilities found in functions like `fetch.get.deferred()`.
 *
 * @example create reusable clients
 * ```javascript
 * import { createClient } from '@superutils/fetch'
 *
 * // Create a "GET" client with default headers and a 5-second timeout
 * const apiClient = createClient(
 * 	{
 * 		// fixed options cannot be overridden
 * 		method: 'get',
 * 	},
 * 	{
 * 		// default options can be overridden
 * 		headers: {
 * 			Authorization: 'Bearer my-secret-token',
 * 			'Content-Type': 'application/json',
 * 		},
 * 		timeout: 5000,
 * 	},
 * 	{
 * 		// default defer options (can be overridden)
 * 		delayMs: 300,
 * 		retry: 2, // If request fails, retry up to two more times
 * 	},
 * )
 *
 * // Use it just like the standard fetch
 * apiClient('https://dummyjson.com/products/1', {
 * 	// The 'method' property cannot be overridden as it is used in the fixed options when creating the client.
 * 	// In TypeScript, the compiler will not allow this property.
 * 	// In Javascript, it will simply be ignored.
 * 	// method: 'post',
 * 	timeout: 3000, // The 'timeout' property can be overridden
 * }).then(console.log, console.warn)
 *
 * // create a deferred client using "apiClient"
 * const deferredClient = apiClient.deferred(
 * 	{ retry: 0 }, // disable retrying by overriding the `retry` defer option
 * 	'https://dummyjson.com/products/1',
 * 	{ timeout: 3000 },
 * )
 * deferredClient({ timeout: 10000 }) // timeout is overridden by individual request
 * 	.then(console.log, console.warn)
 * ```
 */
export const createClient = <
	FixedOpts extends FetchOptions | undefined,
	CommonOpts extends ExcludeOptions<FixedOpts> | undefined,
	FixedAs extends FetchAs | undefined = FetchAsFromOptions<
		FixedOpts,
		undefined
	>,
	CommonDelay extends number = number,
>(
	/** Mandatory fetch options that cannot be overriden by individual request */
	fixedOptions?: FixedOpts,
	/** Common fetch options that can be overriden by individual request */
	commonOptions?: FetchOptions & CommonOpts,
	commonDeferOptions?: DeferredAsyncOptions<unknown, CommonDelay>,
) => {
	const func = <
		T = unknown,
		TOptions extends ExcludeOptions<FixedOpts> | undefined =
			| ExcludeOptions<FixedOpts>
			| undefined,
		TAs extends FetchAs = FixedAs extends FetchAs
			? FixedAs
			: FetchAsFromOptions<TOptions, FetchAsFromOptions<CommonOpts>>,
		TReturn = FetchResult<T>[TAs],
	>(
		url: FetchArgs[0],
		options?: TOptions,
	) => {
		return fetch<TReturn>(
			url,
			mergePartialOptions(
				commonOptions,
				options,
				fixedOptions,
			) as TOptions,
		)
	}

	/** Make requests with debounce/throttle behavior */
	func.deferred = <
		ThisArg,
		Delay extends CommonDelay | number,
		DefaultUrl extends FetchArgs[0] | undefined = FetchArgs[0] | undefined,
		DefaultOptions extends ExcludeOptions<FixedOpts> | undefined =
			| ExcludeOptions<FixedOpts>
			| undefined,
	>(
		deferOptions = {} as DeferredAsyncOptions<ThisArg, Delay>,
		defaultUrl?: DefaultUrl,
		defaultOptions?: DefaultOptions,
	) => {
		let _abortCtrl: AbortController | undefined
		const fetchCb = <
			TResult = unknown,
			TOptions extends ExcludeOptions<FixedOpts> | undefined =
				| ExcludeOptions<FixedOpts>
				| undefined,
			TAs extends FetchAs = FixedAs extends FetchAs
				? FixedAs
				: FetchAsFromOptions<TOptions, FetchAsFromOptions<CommonOpts>>,
			TReturn = FetchResult<TResult>[TAs],
		>(
			...args: DefaultUrl extends undefined
				? [url: FetchArgs[0], options?: TOptions]
				: [options?: TOptions]
		) => {
			const options = (mergePartialOptions(
				commonOptions,
				defaultOptions,
				(defaultUrl === undefined ? args[1] : args[0]) as TOptions,
				fixedOptions,
			) ?? {}) as FetchOptions
			// make sure to abort any previously pending request
			_abortCtrl?.signal?.aborted === false && _abortCtrl?.abort?.()
			// ensure AbortController is present in options and propagete external abort signal if provided
			_abortCtrl = new AbortController()

			const promise = fetch<TReturn>(
				(defaultUrl ?? args[0]) as FetchArgs[0],
				options,
			)
			return promise
		}

		return deferredCallback(fetchCb, {
			...commonDeferOptions,
			...deferOptions,
		} as DeferredAsyncOptions<ThisArg, CommonDelay>) as typeof fetchCb
	}

	return func
}
export default createClient
