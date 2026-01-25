import { ValueOrPromise } from '../types'
import debounce from './debounce'
import throttle from './throttle'
import { DeferredOptions } from './types'

/**
 * Returns a function that can be used to debounce/throttle calls to the provided callback function.
 * All errors will be gracefully swallowed. See {@link debounce} and {@link throttle} for more information.
 *
 * @param callback function to be invoked after delay
 * @param delay (optional) delay duration in milliseconds. Default: `50`
 * @param config (optional) debounce or throttle configuration options
 *
 * @returns Callback function that can be invoked in one of the following 2 methods:
 * - debounced: when `throttle` is `false` or `undefined`
 * - throttled: when `throttle` is `true`
 */
export const deferred = <TArgs extends unknown[], ThisArg, Delay = unknown>(
	callback: (this: ThisArg, ...args: TArgs) => ValueOrPromise<unknown>,
	delay: Delay = 50 as Delay,
	config: DeferredOptions<ThisArg> = {},
) =>
	config.throttle
		? throttle<TArgs, ThisArg>(callback, delay as number, config)
		: debounce<TArgs, ThisArg>(callback, delay as number, config)

export default deferred
