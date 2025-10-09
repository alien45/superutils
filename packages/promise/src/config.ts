import {
	DeferredOptions,
	FetchErrMsgs,
	ResolveError,
	ResolveIgnored,
	FetchAs,
	FetchOptionsInterceptor,
} from './types'

/** Global configuration */
export const config = {
	/** Global default values */
	defaults: {
		/** Default value for `options` used by `PromisE.*deferred*` functions */
		deferOptions: {
			delayMs: 100,
			resolveError: ResolveError.REJECT,
			resolveIgnored: ResolveIgnored.WITH_LAST,
			throttle: false,
		} as DeferredOptions,
		delayTimeoutMsg: 'Timed out after',
		/** Global defalut values for fetch (get, post....) requests and global interceptors */
		fetchOptions: {
			as: FetchAs.json,
			errMsgs: {
				invalidUrl: 'Invalid URL',
				parseFailed: 'Failed to parse response as',
				reqTimedout: 'Request timed out',
				requestFailed: 'Request failed with status code:',
			} as Required<FetchErrMsgs>,
			headers: new Headers([['content-type', 'application/json']]),
			/** Global interceptors for fetch requests */
			interceptors: {
				/**
				 * Global error interceptors to be invoked whenever an exception occurs
				 * Returning an
				 */
				error: [],
				/** Interceptors to be invoked before making fetch requests */
				request: [],
				response: [],
				result: [],
			},
			retry: 0,
			retryBackOff: 'exponential',
			retryDelayMs: 300,
			retryDelayJitter: true,
			timeout: 0,
		} as FetchOptionsInterceptor,
	},
}

export type Config = typeof config

export default config
