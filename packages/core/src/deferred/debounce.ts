import fallbackIfFails from '../fallbackIfFails'
import { ValueOrPromise } from '../types'
import { DebounceOptions } from './types'

/**
 * Returns a function that invokes the callback function after certain delay/timeout.
 * All errors will be gracefully swallowed.
 *
 * @param	callback 	function to be invoked after timeout
 * @param	delay		(optional) timeout duration in milliseconds. Default: 50
 * @param   config.onError (optional)
 * @param   config.leading (optional) if true, will enable leading-edge debounce mechanism.
 * @param   config.thisArg (optional) the special `thisArgs` to be used when invoking the callback.
 * @param	config.tid	   (optional) Timeout Id. If provided, will clear the timeout on first invocation.
 *
 * @example Debounce function calls
 * ```javascript
 * import { debounce } from '@superutils/core'
 *
 * const handleChange = debounce(
 *     event => console.log('Value:', event.target.value),
 *     300 // debounce delay in milliseconds
 * )
 *
 * handleChange({ target: { value: 1 } }) // will be ignored
 * handleChange({ target: { value: 2 } }) // will be ingored
 * handleChange({ target: { value: 3 } }) // will be invoked
 * ```
 */
export const debounce = <TArgs extends unknown[], ThisArg>(
	callback: (this: ThisArg, ...args: TArgs) => ValueOrPromise<unknown>,
	delay = 50,
	config: DebounceOptions<ThisArg> = {},
) => {
	const {
		leading = debounce.defaults.leading,
		onError = debounce.defaults.onError,
		thisArg,
	} = config
	let { tid } = config
	if (thisArg !== undefined) callback = callback.bind(thisArg as ThisArg)
	const _callback = (...args: TArgs) =>
		fallbackIfFails(callback, args, onError)

	let firstArgs: TArgs | true | null = null // true => global leading already executed
	const leadingGlobal = leading === 'global'
	return (...args: TArgs) => {
		clearTimeout(tid)
		tid = setTimeout(() => {
			// prevent redundant callback when leading is enabled
			firstArgs !== args && _callback(...args)
			firstArgs = leadingGlobal ? true : null
		}, delay)

		// not leading OR executed global leading
		if (!leading || firstArgs) return

		firstArgs = args
		_callback(...args)
	}
}
debounce.defaults = {
	/**
	 * Set the default value of argument `leading` for the `deferred` function.
	 * This change is applicable application-wide and only applies to any new invocation of `deferred()`.
	 */
	leading: false,
	/**
	 * Set the default value of argument `onError` for the `deferred` function.
	 * This change is applicable application-wide and only applies to any new invocation of `deferred()`.
	 */
	onError: undefined,
} satisfies DebounceOptions

export default debounce
