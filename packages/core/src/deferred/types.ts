import { ValueOrPromise, TimeoutId } from '../types'

/**
 * Debounce function options
 */
export type DebounceOptions<ThisArg = unknown> = {
	leading?: boolean | 'global'
	onError?: (this: ThisArg, err: unknown) => ValueOrPromise<unknown>
	thisArg?: ThisArg
	tid?: TimeoutId
}

/**
 * Deferred function options
 */
export type DeferredOptions<ThisArg = unknown> =
	| ({
			// Throttle mode
			throttle: true
	  } & ThrottleOptions<ThisArg>)
	| ({
			// Debounce/deferred mode
			throttle?: false
	  } & DebounceOptions<ThisArg>)

/**
 * Throttle function options
 */
export type ThrottleOptions<ThisArg = unknown> = {
	/**
	 *
	 * @param err Error object thrown by the callback function.
	 * @returns
	 */
	onError?: (this: ThisArg, err: unknown) => ValueOrPromise<unknown>
	thisArg?: ThisArg
	trailing?: boolean
	tid?: TimeoutId
}
