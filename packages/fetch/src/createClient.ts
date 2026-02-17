import { DeferredAsyncOptions, deferredCallback } from '@superutils/promise'
import fetch from './fetch'
import mergeOptions from './mergeOptions'
import type {
	ExtractAs,
	ExcludeOptions,
	FetchArgs,
	FetchOptions,
	GetFetchResult,
	IPromise_Fetch,
} from './types'
import { FetchAs } from './types'

/**
 * Defines client generic parameter T based on fixed options.
 *
 * If `fixedOptions.as` is defined and not `FetcAs.json`, then `T` will be `never`.
 */
export type ClientData<FixedOptions> =
	ExtractAs<[FixedOptions]> extends FetchAs.json ? unknown : never // disallow providing T
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
 * @example
 * #### Create reusable clients
 * ```javascript
 * import { createClient } from '@superutils/fetch'
 *
 * // Create a "GET" client with default headers and a 5-second timeout
 * const apiClient = createClient(
 * 	 { method: 'get' }, // fixed options cannot be overridden
 * 	 { // default options can be overridden
 * 	   headers: {
 * 	   	Authorization: 'Bearer my-secret-token',
 * 	   	'Content-Type': 'application/json',
 * 	   },
 * 	   timeout: 5000,
 * 	 },
 * 	 {// default defer options (can be overridden)
 * 	   delay: 300,
 * 	   retry: 2, // If request fails, retry up to two more times
 * 	 },
 * )
 *
 * // Use it just like the standard fetch
 * apiClient('https://dummyjson.com/products/1', {
 *   // The 'method' property cannot be overridden as it is used in the fixed options when creating the client.
 *   // In TypeScript, the compiler will not allow this property.
 *   // In Javascript, it will simply be ignored.
 *   // method: 'post',
 *   timeout: 3000, // The 'timeout' property can be overridden
 * }).then(console.log, console.warn)
 *
 * // create a deferred client using "apiClient"
 * const deferredClient = apiClient.deferred(
 *   { retry: 0 }, // disable retrying by overriding the `retry` defer option
 *   'https://dummyjson.com/products/1',
 *   { timeout: 3000 },
 * )
 * deferredClient({ timeout: 10000 }) // timeout is overridden by individual request
 * 	.then(console.log, console.warn)
 * ```
 */
export const createClient = <
	FixedOptions extends FetchOptions | undefined,
	CommonOptions extends ExcludeOptions<FixedOptions> | undefined,
	CommonDelay extends number,
>(
	/** Mandatory fetch options that cannot be overriden by individual request */
	fixedOptions?: FixedOptions,
	/** Common fetch options that can be overriden by individual request */
	commonOptions?: FetchOptions & CommonOptions,
	commonDeferOptions?: DeferredAsyncOptions<unknown, CommonDelay>,
) => {
	function client<
		T extends ClientData<FixedOptions> = never,
		TOptions extends ExcludeOptions<FixedOptions> | undefined =
			| ExcludeOptions<FixedOptions>
			| undefined,
		Result = GetFetchResult<[FixedOptions, TOptions, CommonOptions], T>,
	>(url: FetchArgs[0], options?: TOptions): IPromise_Fetch<Result> {
		const mergedOptions = mergeOptions(
			fetch.defaults,
			commonOptions,
			options,
			fixedOptions, // fixed options will always override other options
		)
		mergedOptions.as ??= FetchAs.json
		return fetch(url, mergedOptions)
	}

	/** Make requests with debounce/throttle behavior */
	client.deferred = <
		ThisArg,
		Delay extends CommonDelay | number,
		DefaultUrl extends FetchArgs[0] | undefined = FetchArgs[0] | undefined,
		DefaultOptions extends ExcludeOptions<FixedOptions> | undefined =
			| ExcludeOptions<FixedOptions>
			| undefined,
	>(
		deferOptions?: DeferredAsyncOptions<ThisArg, Delay>,
		defaultUrl?: DefaultUrl,
		defaultOptions?: DefaultOptions,
	) => {
		let _abortCtrl: AbortController | undefined
		const fetchCb = <
			T extends ClientData<FixedOptions> = never,
			TOptions extends ExcludeOptions<FixedOptions> | undefined =
				| ExcludeOptions<FixedOptions>
				| undefined,
			Result = GetFetchResult<
				[FixedOptions, TOptions, DefaultOptions, CommonOptions],
				T
			>,
		>(
			...args: DefaultUrl extends undefined
				? [url: FetchArgs[0], options?: TOptions]
				: [options?: TOptions]
		): IPromise_Fetch<Result> => {
			const mergedOptions = (mergeOptions(
				fetch.defaults,
				commonOptions,
				defaultOptions,
				(defaultUrl === undefined ? args[1] : args[0]) as TOptions,
				fixedOptions, // fixed options will always override other options
			) ?? {}) as FetchOptions
			mergedOptions.as ??= FetchAs.json
			// make sure to abort any previously pending request
			_abortCtrl?.abort?.()
			// ensure AbortController is present in options and propagete external abort signal if provided
			_abortCtrl = new AbortController()

			return fetch(
				(defaultUrl ?? args[0]) as FetchArgs[0],
				mergedOptions,
			) as unknown as IPromise_Fetch<Result>
		}

		return deferredCallback(fetchCb, {
			...commonDeferOptions,
			...deferOptions,
		} as DeferredAsyncOptions<ThisArg, CommonDelay>) as typeof fetchCb
	}

	return client
}
export default createClient
