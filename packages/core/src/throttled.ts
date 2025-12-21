import fallbackIfFails from './fallbackIfFails'
import { TimeoutId, ValueOrPromise } from './types'

export type ThrottleOptions<ThisArg = unknown> = {
	onError?: (err: unknown) => ValueOrPromise<unknown>
	thisArg?: ThisArg
	trailing?: boolean
	tid?: TimeoutId
}

/**
 * @function throttle
 * @summary returns a function that invokes the `callback` maximum twice (once if `executeLast = false`) per interval
 *
 * @param	callback function to be invoked after timeout
 * @param	delay	 (optional) interval duration in milliseconds. Default: 50
 * @param   config.onError  (optional)
 * @param   config.tid      (optional)
 * @param	config.thisArg  (optional) the special `thisArgs` to be used when invoking the callback.
 * @param   config.trailing (optional) whether to enable trailing edge execution. Default: `true`
 *
 * @example
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
 * ```
 */
export const throttled = <TArgs extends unknown[], ThisArg>(
	callback: (this: ThisArg, ...args: TArgs) => ValueOrPromise<unknown>,
	delay = 50,
	config: ThrottleOptions<ThisArg> = {},
) => {
	const { defaults: d } = throttled
	const { onError = d.onError, trailing = d.trailing, thisArg } = config
	let { tid } = config
	if (thisArg !== undefined) callback = callback.bind(thisArg)
	const _callback = (...args: TArgs) =>
		fallbackIfFails(callback, args, onError)

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
			cbArgs && cbArgs !== args && _callback(...cbArgs)
		}, delay)
		_callback(...args)
	}
}
/**
 * Set the default values
 * This change is applicable application-wide and only applies to any new invocation of `throttle()`.
 */
throttled.defaults = {
	onError: undefined,
	trailing: true,
} satisfies ThrottleOptions
export default throttled
