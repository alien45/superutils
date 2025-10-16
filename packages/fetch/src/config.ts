import {
	config as promiseConfig,
	type Config as PromiseConfig,
} from '@superutils/promise'
import { FetchErrMsgs, FetchAs, FetchOptionsInterceptor } from './types'

const fetchOptions = {
	as: FetchAs.json,
	errMsgs: {
		invalidUrl: 'Invalid URL',
		parseFailed: 'Failed to parse response as',
		reqTimedout: 'Request timed out',
		requestFailed: 'Request failed with status code:',
	} as Required<FetchErrMsgs>, // all error messages must be defined here
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
	...promiseConfig.retryOptions,
	retryIf: null,
	timeout: 0,
} as FetchOptionsInterceptor
export type Config = PromiseConfig & {
	fetchOptions: FetchOptionsInterceptor
}

export const config = promiseConfig as Config
config.fetchOptions = fetchOptions

export default config
