import fallbackIfFails from '../fallbackIfFails'
import { isFn } from '../is'
import { ValueOrPromise } from '../types'
import { ThrottleOptions } from './types'

/**
 * Returns a throttled function that ensures the callback is invoked at most once in the specified delay interval.
 * All errors will be gracefully swallowed.
 *
 * If the throttled function is called multiple times during the delay interval, only the first call will invoke the callback immediately.
 *
 * If `trailing` is enabled and if returned function is invoked more than once during the delay interval,
 * the callback runs again at the end of the delay with the most recent arguments.
 *
 * @param callback function to be invoked after timeout
 * @param delay (optional) interval duration in milliseconds. Default: 50
 * @param config (optional)
 * @param config.onError (optional) callback to be invoked on error
 * @param config.tid (optional)
 * @param config.thisArg (optional) the special `thisArgs` to be used when invoking the callback.
 * @param config.trailing (optional) whether to enable trailing edge execution. Default: `true`
 *
 * @example
 * #### Throttle function calls
 * ```javascript
 * import { throttle } from '@superutils/core'
 *
 * const handleChange = throttle(
 *     event => console.log('Value:', event.target.value),
 *     300, // throttle duration in milliseconds
 * )
 * handleChange({ target: { value: 1 } }) // will be executed
 * handleChange({ target: { value: 2 } }) // will be ignored
 * handleChange({ target: { value: 3 } }) // will be ignored
 *
 * setTimeout(() => {
 *    handleChange({ target: { value: 4 } }) // will be executed (after 300ms)
 *    handleChange({ target: { value: 5 } }) // will be ignored
 * }, 400)
 * ```
 *
 * @example
 * #### Throttle with trailing enabled
 * ```javascript
 * import { throttle } from '@superutils/core'
 *
 * const handleChange = throttle(
 *     event => console.log('Value:', event.target.value),
 *     300, // throttle duration in milliseconds
 * )
 * handleChange({ target: { value: 1 } }) // will be executed
 * handleChange({ target: { value: 2 } }) // will be ignored
 * handleChange({ target: { value: 3 } }) //  will be executed
 *
 * setTimeout(() => {
 *    handleChange({ target: { value: 4 } }) // will be executed
 *    handleChange({ target: { value: 5 } }) // will be ignored
 * }, 400)
 * ```
 */
export const throttle = <TArgs extends unknown[], ThisArg>(
	callback: (this: ThisArg, ...args: TArgs) => ValueOrPromise<unknown>,
	delay = 50,
	config: ThrottleOptions<ThisArg> = {},
) => {
	const { defaults: d } = throttle
	const { onError = d.onError, trailing = d.trailing, thisArg } = config
	let { tid } = config
	const handleCallback = (...args: TArgs) =>
		fallbackIfFails(
			thisArg !== undefined ? callback.bind(thisArg) : callback,
			args,
			!isFn(onError)
				? undefined
				: (err: unknown) => fallbackIfFails(onError, [err], undefined),
		)

	let trailArgs: TArgs | null = null
	return (...args: TArgs) => {
		if (tid) {
			trailArgs = args
			return
		}

		tid = setTimeout(() => {
			tid = undefined
			if (!trailing) return

			const cbArgs = trailArgs
			trailArgs = null
			cbArgs && cbArgs !== args && handleCallback(...cbArgs)
		}, delay)
		handleCallback(...args)
	}
}
/**
 * Set the default values
 * This change is applicable application-wide and only applies to any new invocation of `throttle()`.
 */
throttle.defaults = {
	onError: undefined,
	trailing: false,
} satisfies ThrottleOptions

/**
 * For legacy compatibility
 * @deprecated use `throttle` instead
 */
export const throttled = throttle
export default throttle
