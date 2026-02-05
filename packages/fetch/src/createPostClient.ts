import { deferredCallback } from '@superutils/promise'
import fetch from './fetch'
import { getAbortCtrl } from './getAbortCtrl'
import { mergePartialOptions } from './mergeFetchOptions'
import {
	DeferredAsyncOptions,
	ExcludePostOptions,
	FetchAs,
	FetchAsFromOptions,
	FetchResult,
	PostArgs,
	PostDeferredCbArgs,
	PostOptions,
} from './types'
import { IPromisE_Timeout } from '@superutils/promise'

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
 * @example create reusable clients
 * ```javascript
 * import { createPostClient, FetchAs } from '@superutils/fetch'
 *
 * // Create a POST client with 10-second as the default timeout
 * const postClient = createPostClient(
 * 	{
 * 		method: 'post',
 * 		headers: { 'content-type': 'application/json' },
 * 	},
 * 	{ timeout: 10000 },
 * )
 *
 * // Invoking `postClient()` automatically applies the pre-configured options
 * postClient(
 * 	'https://dummyjson.com/products/add',
 * 	{ title: 'New Product' }, // data/body
 * 	{}, // other options
 * ).then(console.log)
 *
 * // create a deferred client using "postClient"
 * const updateProduct = postClient.deferred(
 * 	{
 * 		delayMs: 300, // debounce duration
 * 		onResult: console.log, // prints only successful results
 * 	},
 * 	'https://dummyjson.com/products/add',
 * 	{
 * 		method: 'patch',
 * 		timeout: 3000,
 * 	},
 * )
 * updateProduct({ title: 'New title 1' }) // ignored by debounce
 * updateProduct({ title: 'New title 2' }) // executed
 * ```
 */
export const createPostClient = <
	FixedOpts extends PostOptions | undefined,
	CommonOpts extends ExcludePostOptions<FixedOpts> | undefined,
	FixedAs extends FetchAs | undefined = FetchAsFromOptions<
		FixedOpts,
		undefined
	>,
>(
	/** Mandatory fetch options that cannot be overriden by individual request */
	fixedOptions?: FixedOpts,
	/** Common fetch options that can be overriden by individual request */
	commonOptions?: PostOptions & CommonOpts,
	commonDeferOptions?: DeferredAsyncOptions<unknown, unknown>,
) => {
	/**
	 * Executes the HTTP request using the configured client options.
	 *
	 * This function is specifically designed for methods that require a request body (e.g., POST, PUT, PATCH),
	 * allowing the payload to be passed directly as the second argument.
	 */
	const client = <
		T = unknown,
		TOptions extends ExcludePostOptions<FixedOpts> | undefined =
			| ExcludePostOptions<FixedOpts>
			| undefined,
		TAs extends FetchAs = FixedAs extends FetchAs
			? FixedAs
			: FetchAsFromOptions<TOptions, FetchAsFromOptions<CommonOpts>>,
		TReturn = FetchResult<T>[TAs],
	>(
		url: PostArgs[0],
		data?: PostArgs[1],
		options?: TOptions,
	): IPromisE_Timeout<TReturn> => {
		const _options = mergePartialOptions(
			commonOptions,
			options,
			fixedOptions,
		) as PostOptions
		_options.body = data
		_options.method ??= 'post'
		return fetch<TReturn>(url, _options)
	}

	/**
	 * Returns a version of the client configured for debounced, throttled, or sequential execution.
	 *
	 * This is particularly useful for optimizing high-frequency operations, such as auto-saving forms
	 * or managing rapid state updates, by automatically handling request cancellation and execution timing.
	 */
	client.deferred = <
		ThisArg,
		Delay extends number,
		DefaultUrl extends PostArgs[0] | undefined,
		DefaultData extends PostArgs[1] = undefined,
		DefaultOptions extends ExcludePostOptions<FixedOpts> | undefined =
			undefined,
	>(
		deferOptions: DeferredAsyncOptions<
			ThisArg,
			Delay
		> = {} as DeferredAsyncOptions<ThisArg, Delay>,
		defaultUrl?: DefaultUrl,
		defaultData?: DefaultData,
		defaultOptions?: DefaultOptions,
	) => {
		let _abortCtrl: AbortController | undefined
		const postCb = <
			TResult = unknown,
			TOptions extends ExcludePostOptions<FixedOpts> | undefined =
				ExcludePostOptions<FixedOpts>, // | undefined,
			TAs extends FetchAs = FixedAs extends FetchAs
				? FixedAs
				: FetchAsFromOptions<TOptions, FetchAsFromOptions<CommonOpts>>,
			TReturn = FetchResult<TResult>[TAs],
		>(
			...args: PostDeferredCbArgs<DefaultUrl, DefaultData, TOptions>
		): IPromisE_Timeout<TReturn> => {
			// add default url to the beginning of the array
			if (defaultUrl !== undefined) args.splice(0, 0, defaultUrl)
			// add default data after the url
			if (defaultData !== undefined) args.splice(1, 0, defaultData)
			const options = mergePartialOptions(
				commonOptions,
				defaultOptions,
				args[2] as TOptions,
				fixedOptions,
			) as PostOptions
			// make sure to abort any previously pending request
			_abortCtrl?.signal?.aborted === false && _abortCtrl?.abort?.()
			// ensure AbortController is present in options and propagete external abort signal if provided
			_abortCtrl = getAbortCtrl(options)

			// attach body to options
			options.body = (args[1] ?? options.body) as PostArgs[1]
			options.method ??= 'post'
			const promise = fetch<TReturn>(args[0] as PostArgs[0], options)
			// abort fetch request if promise is finalized manually before completion
			// by invoking `promise.reject()` or `promise.resolve()
			promise.onEarlyFinalize.push(() => _abortCtrl?.abort())
			return promise
		}

		return deferredCallback(postCb, {
			...commonDeferOptions,
			...deferOptions,
		} as typeof deferOptions) as typeof postCb
	}

	return client
}
export default createPostClient
