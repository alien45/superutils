import PromisE, { DeferredAsyncOptions } from '@superutils/promise'
import mergeFetchOptions from './mergeFetchOptions'
import post from './post'
import { PostArgs, PostDeferredCbArgs } from './types'

/**
 * Creates a deferred/throttled function for making `DELETE`, `POST`, `PUT`, or `PATCH` requests, powered by
 * {@link PromisE.deferred}.
 *
 * This is ideal for scenarios like auto-saving form data, preventing duplicate submissions on button clicks,
 * or throttling API updates.
 *
 * Like `fetchDeferred`, it automatically aborts pending requests when a new one is initiated, ensuring only
 * the most recent or relevant action is executed.
 *
 * @param deferOptions Configuration for the deferred execution behavior (e.g., `delayMs`, `throttle`).
 * See {@link DeferredAsyncOptions} for details.
 * @param defaultUrl (optional) If default URL is `undefined`, returned callback will always require an URL.
 * @param defaultData (optional) If default data is `undefined`, returned callback will allow a data parameter.
 * @param defaultOptions (optional) Default {@link FetchOptions} to be used by the returned function.
 * Default options will be merged with the options provided in the callback.
 * If the same property is provided in both cases, defaults will be overriden by the callback.
 *
 *
 * #### Example 1: Auto-saving form data with throttling
 *
 * ```typescript
 * import fetch from '@superutils/fetch'
 * import PromisE from '@superutils/promise'
 *
 * // Create a throttled function to auto-save product updates.
 * const saveProductThrottled = fetch.post.deferred(
 * 	{
 * 		delayMs: 1000, // Throttle window of 1 second
 * 		throttle: true,
 * 		trailing: true, // Ensures the very last update is always saved
 * 		onResult: product => console.log(`[Saved] Product: ${product.title}`),
 * 	},
 * 	'https://dummyjson.com/products/add', // Default URL
 * )
 * // Simulate a user typing quickly, triggering multiple saves.
 * console.log('User starts typing...')
 * saveProductThrottled({ title: 'iPhone' }) // Executed immediately (leading edge)
 * await PromisE.delay(200)
 * saveProductThrottled({ title: 'iPhone 15' }) // Ignored (within 1000ms throttle window)
 * await PromisE.delay(300)
 * saveProductThrottled({ title: 'iPhone 15 Pro' }) // Ignored
 * await PromisE.delay(400)
 * saveProductThrottled({ title: 'iPhone 15 Pro Max' }) // Queued to execute on the trailing edge
 * // Outcome:
 * // The first call ('iPhone') is executed immediately.
 * // The next two calls are ignored by the throttle.
 * // The final call ('iPhone 15 Pro Max') is executed after the 1000ms throttle window closes,
 * // thanks to `trailing: true`.
 * // This results in only two network requests instead of four.
 * ```
 *
 * #### Example 2: debouncing an authentication token refresh
 *
 * ```typescript
 * import fetch from '@superutils/fetch'
 * import PromisE from '@superutils/promise'
 *
 * // Mock a simple token store
 * let currentRefreshToken = ''
 * // Create a debounced function to refresh the auth token.
 * // It waits 300ms after the last call before executing.
 * const requestNewToken = fetch.post.deferred(
 * 	{
 * 		delayMs: 300, // debounce delay
 * 		onResult: ({ token = '' }) => {
 * 			console.log(
 * 				`Auth token successfully refreshed at ${new Date().toISOString()}`,
 * 			)
 * 			currentRefreshToken = token
 * 		},
 * 	},
 * 	'https://dummyjson.com/auth/refresh', // Default URL
 * 	() => ({
 * 		refreshToken: currentRefreshToken,
 * 		expiresInMins: 30,
 * 	}),
 * )
 *
 * // First authenticate user to get the initial refresh token and then request new referesh tokens
 * fetch
 * 	.post<{ refreshToken: string }>(
 * 		'https://dummyjson.com/auth/login',
 * 		{
 * 			username: 'emilys',
 * 			password: 'emilyspass',
 * 			expiresInMins: 30,
 * 		},
 * 		{ credentials: 'include' },
 * 	)
 * 	.then(result => {
 * 		currentRefreshToken = result?.refreshToken
 *
 * 		requestNewToken() // Called at 0ms
 * 		PromisE.delay(50, requestNewToken) // Called at 50ms
 * 		PromisE.delay(100, requestNewToken) // Called at 100ms
 * 	}, console.error)
 * // Outcome:
 * // The first two calls are aborted by the debounce mechanism.
 * // Only the final call executes, 300ms after it was made (at the 400ms mark).
 * // The token is refreshed only once, preventing redundant network requests.
 * ```
 */
export function postDeferred<
	ThisArg,
	Delay extends number = number,
	DefaultUrl extends PostArgs[0] | undefined = undefined,
	DefaultData extends PostArgs[1] | undefined = undefined,
	// Conditionally define the arguments for the returned function
	CbArgs extends unknown[] = PostDeferredCbArgs<
		DefaultUrl,
		DefaultData,
		false // allow callback override 'method' in options
	>,
>(
	deferOptions: DeferredAsyncOptions<ThisArg, Delay> = {},
	defaultUrl?: DefaultUrl,
	defaultData?: DefaultData,
	defaultOptions?: PostArgs[2],
) {
	let _abortCtrl: AbortController | undefined
	const doPost = <Result = unknown>(...args: CbArgs) => {
		// add default url to the beginning of the array
		if (defaultUrl !== undefined) args.splice(0, 0, defaultUrl)
		// add default data after the url
		if (defaultData !== undefined) args.splice(1, 0, defaultData)

		const options = mergeFetchOptions(defaultOptions ?? {}, args[2] ?? {})
		options.abortCtrl ??= new AbortController()
		// make sure to abort any previous pending request
		_abortCtrl?.abort?.()
		_abortCtrl = options.abortCtrl
		const promise = post<Result>(
			args[0] as PostArgs[0],
			args[1] as PostArgs[1],
			options as PostArgs[2],
		)
		// abort post request if promise is finalized manually before completion
		// by invoking `promise.reject()` or `promise.resolve()`
		promise.onEarlyFinalize.push(() => _abortCtrl?.abort())
		return promise
	}

	return PromisE.deferredCallback(doPost, deferOptions)
}
export default postDeferred
