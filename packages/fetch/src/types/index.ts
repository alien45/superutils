import { IPromisE_Timeout } from '@superutils/promise'

export * from './constants'
export * from './FetchError'
export * from './interceptors'
export * from './options'

export type IPromise_Fetch<T> = Omit<IPromisE_Timeout<T>, 'abortCtrl'> & {
	/** An `AbortController` instance to control the request.  */
	abortCtrl: AbortController
}

// Export useful export from PromisE for ease of use
export {
	type DeferredAsyncOptions,
	ResolveError,
	ResolveIgnored,
	TIMEOUT_FALLBACK,
	TIMEOUT_MAX,
	TimeoutPromise,
} from '@superutils/promise'
