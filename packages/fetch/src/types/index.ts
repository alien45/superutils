import { IPromisE_Timeout } from '@superutils/promise'

export * from './constants'
export * from './FetchError'
export * from './interceptors'
export * from './options'

export type IPromise_Fetch<T = unknown> = Omit<
	IPromisE_Timeout<T>,
	'abortCtrl'
> & {
	/** An `AbortController` instance to control the request.  */
	abortCtrl: AbortController
}
