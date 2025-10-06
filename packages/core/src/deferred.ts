import fallbackIfFails from './fallbackIfFails'
import { asAny } from './forceCast'
import { TimeoutId } from './types'

export type DeferredConfig<ThisArg = unknown> = {
	leading?: boolean | 'global'
	onError?: (err: any) => any | Promise<any>
	thisArg?: ThisArg
	tid?: TimeoutId
}

/**
 * @function deferred AKA debounce
 * @summary returns a function that invokes the callback function after certain delay/timeout.
 * All errors will be gracefully swallowed.
 *
 * @param	callback 	function to be invoked after timeout
 * @param	delay		(optional) timeout duration in milliseconds. Default: 50
 * @param   config.onError (optional)
 * @param   config.leading (optional) if true, will enable leading-edge debounce mechanism.
 * @param   config.thisArg (optional) the special `thisArgs` to be used when invoking the callback.
 * @param	config.tid	   (optional) Timeout Id. If provided, will clear the timeout on first invocation.
 */
export const deferred = <TArgs extends unknown[], ThisArg>(
	callback: (this: ThisArg, ...args: TArgs) => any | Promise<any>,
	delay: number = 50,
	config: DeferredConfig<ThisArg> = {},
) => {
	const {
		leading = deferred.defaults.leading,
		onError = deferred.defaults.onError,
		thisArg,
	} = config
	let { tid } = config
	if (thisArg !== undefined) callback = callback.bind(thisArg)
	const _callback = callback
	callback = (...args: TArgs) => fallbackIfFails(_callback, args, onError)

	let firstArgs: TArgs | true | null = null // true => global leading already executed
	const leadingGlobal = leading === 'global'
	return (...args: TArgs) => {
		clearTimeout(tid)
		tid = setTimeout(() => {
			// prevent redundant callback when leading is enabled
			firstArgs !== args && asAny(callback)(...args)
			firstArgs = leadingGlobal ? true : null
		}, delay)

		// not leading OR executed global leading
		if (!leading || firstArgs) return

		firstArgs = args
		asAny(callback)(...args)
	}
}
deferred.defaults = {
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
} satisfies DeferredConfig
export default deferred
