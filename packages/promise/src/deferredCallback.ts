import deferred from './deferred'
import { IPromisE, DeferredAsyncOptions } from './types'

/**
 * @function PromisE.deferredCallback
 *
 * @summary a `PromisE.deferred()` wrapper for callbacks and event handlers.
 *
 * @returns deferred/throttled function
 *
 *
 * @example Debounce/deferred event handler
 * ```typescript
 * import PromisE from '@superutils/promise'
 *
 * // Input change handler
 * const handleChange = (e: { target: { value: number } }) =>
 * 	   console.log(e.target.value)
 * // Change handler with `PromisE.deferred()`
 * const handleChangeDeferred = PromisE.deferredCallback(handleChange, {
 * 	   delay: 300,
 * 	   throttle: false,
 * })
 * // Simulate input change events after prespecified delays
 * const delays = [100, 150, 200, 550, 580, 600, 1000, 1100]
 * delays.forEach(timeout =>
 * 	   setTimeout(
 * 	   	   () => handleChangeDeferred({ target: { value: timeout } }),
 * 	   	   timeout,
 * 	   ),
 * )
 * // Prints:
 * // 200, 600, 1100
 * ```
 */
export function deferredCallback<
	TDefault = unknown,
	ThisArg = unknown,
	Delay = unknown,
	CbArgs extends unknown[] = unknown[],
>(
	callback: (...args: CbArgs) => TDefault | Promise<TDefault>,
	options: DeferredAsyncOptions<ThisArg, Delay> = {},
) {
	const { thisArg } = options
	if (thisArg !== undefined) callback = callback.bind(thisArg)
	const deferPromise = deferred<TDefault, ThisArg, Delay>(options)

	return <TResult = TDefault>(...args: CbArgs) =>
		deferPromise(() => callback(...args) as IPromisE<TResult>)
}
export default deferredCallback
