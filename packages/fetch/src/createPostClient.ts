import { DeferredAsyncOptions, deferredCallback } from '@superutils/promise'
import { ClientData } from './createClient'
import fetch from './fetch'
import mergeOptions from './mergeOptions'
import {
	ExcludePostOptions,
	FetchAs,
	PostArgs,
	PostDeferredCbArgs,
	PostOptions,
	IPromise_Fetch,
	GetFetchResult,
	ContentType,
} from './types'

/**
 * Create a reusable fetch client with shared options. The returned function comes attached with a
 * `.deferred()` function for debounced and throttled request.
 * While `createClient()` is versatile enough for any HTTP method, `createPostClient()` is specifically designed for
 * methods that require a request body, such as `DELETE`, `PATCH`, `POST`, and `PUT`. If a method is not provided, it
 * defaults to `POST`. The generated client accepts an additional second parameter (`data`) for the request payload.
 *
 * Similar to `createClient`, the returned function comes equipped with a `.deferred()` method, enabling debounced,
 * throttled, or sequential execution.
 *
 * @example
 * #### Create reusable clients
 * ```javascript
 * import { createPostClient, FetchAs } from '@superutils/fetch'
 *
 * // Create a POST client with 10-second as the default timeout
 * const postClient = createPostClient(
 * 	{ // fixed options cannot be overrided by client calls
 * 	  method: 'post',
 * 	  headers: { 'content-type': 'application/json' },
 * 	},
 * 	{ timeout: 10000 }, // common options that can be overriden by client calls
 * )
 *
 * // Invoking `postClient()` automatically applies the pre-configured options
 * postClient(
 * 	 '[DUMMYJSON-DOT-COM]/products/add',
 * 	 { title: 'New Product' }, // data/body
 * 	 {}, // other options
 * ).then(console.log)
 *
 * // create a deferred client using "postClient"
 * const updateProduct = postClient.deferred(
 * 	{
 * 		delay: 300, // debounce duration
 * 		onResult: console.log, // prints only successful results
 * 	},
 * 	'[DUMMYJSON-DOT-COM]/products/add',
 * 	{ method: 'patch', timeout: 3000 },
 * )
 * updateProduct({ title: 'New title 1' }) // ignored by debounce
 * updateProduct({ title: 'New title 2' }) // executed
 * ```
 */
export const createPostClient = <
	FixedOptions extends PostOptions | undefined,
	CommonOptions extends ExcludePostOptions<FixedOptions> | undefined,
	CommonDelay extends number = number,
>(
	/** Mandatory fetch options that cannot be overriden by individual request */
	fixedOptions?: FixedOptions,
	/** Common fetch options that can be overriden by individual request */
	commonOptions?: PostOptions & CommonOptions,
	commonDeferOptions?: DeferredAsyncOptions<unknown, CommonDelay>,
) => {
	/**
	 * Executes the HTTP request using the configured client options.
	 *
	 * This function is specifically designed for methods that require a request body (e.g., POST, PUT, PATCH),
	 * allowing the payload to be passed directly as the second argument.
	 */
	function client<
		T extends ClientData<FixedOptions> = never,
		Options extends ExcludePostOptions<FixedOptions> | undefined =
			| ExcludePostOptions<FixedOptions>
			| undefined,
		Result = GetFetchResult<[FixedOptions, Options, CommonOptions], T>,
	>(
		url: PostArgs[0],
		data?: PostArgs[1],
		options?: Options,
	): IPromise_Fetch<Result> {
		const mergedOptions = mergeOptions(
			commonOptions,
			options,
			fixedOptions, // fixed options will always override other options
		) as PostOptions
		mergedOptions.as ??= FetchAs.json
		mergedOptions.body = data ?? mergedOptions.body
		mergedOptions.method ??= 'post'

		const headers = mergedOptions.headers as Headers
		if (!headers.get('content-type')) {
			headers.set('content-type', ContentType.APPLICATION_JSON)
		}
		return fetch(url, mergedOptions)
	}

	/**
	 * Returns a version of the client configured for debounced, throttled, or sequential execution.
	 *
	 * This is particularly useful for optimizing high-frequency operations, such as auto-saving forms
	 * or managing rapid state updates, by automatically handling request cancellation and execution timing.
	 */
	client.deferred = <
		ThisArg,
		DefaultUrl extends PostArgs[0] | undefined,
		DefaultData extends PostArgs[1] | undefined,
		DefaultOptions extends ExcludePostOptions<FixedOptions> | undefined =
			| ExcludePostOptions<FixedOptions>
			| undefined,
		Delay extends CommonDelay | number = number,
	>(
		deferOptions?: DeferredAsyncOptions<ThisArg, Delay>,
		defaultUrl?: DefaultUrl,
		defaultData?: DefaultData,
		defaultOptions?: DefaultOptions,
	) => {
		let _abortCtrl: AbortController | undefined
		const postCb = <
			T extends ClientData<FixedOptions> = never,
			Options extends ExcludePostOptions<FixedOptions> | undefined =
				| ExcludePostOptions<FixedOptions>
				| undefined,
			TReturn = GetFetchResult<
				[FixedOptions, Options, DefaultOptions, CommonOptions],
				T
			>,
		>(
			...args: PostDeferredCbArgs<DefaultUrl, DefaultData, Options>
		): IPromise_Fetch<TReturn> => {
			// add default url to the beginning of the array
			if (defaultUrl !== undefined) args.splice(0, 0, defaultUrl)
			// add default data after the url
			if (defaultData !== undefined) args.splice(1, 0, defaultData)
			const mergedOptions = (mergeOptions(
				fetch.defaults,
				commonOptions,
				defaultOptions,
				args[2] as Options,
				fixedOptions, // fixed options will always override other options
			) ?? {}) as PostOptions
			mergedOptions.as ??= FetchAs.json
			// make sure to abort any previously pending request
			_abortCtrl?.abort?.()
			// ensure AbortController is present in options and propagete external abort signal if provided
			_abortCtrl = new AbortController()

			// attach body to options
			mergedOptions.body = (args[1] ?? mergedOptions.body) as PostArgs[1]
			mergedOptions.method ??= 'post'

			const headers = mergedOptions.headers as Headers
			if (!headers.get('content-type')) {
				headers.set('content-type', ContentType.APPLICATION_JSON)
			}
			return fetch(args[0] as PostArgs[0], mergedOptions)
		}

		return deferredCallback(postCb, {
			...commonDeferOptions,
			...deferOptions,
		} as typeof deferOptions) as typeof postCb
	}

	return client
}
export default createPostClient
