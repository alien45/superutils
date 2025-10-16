import deferred from './deferred'
import { IPromisE, DeferredOptions } from './types'

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
 * const handleChange = (e: { target: { value: number }}) => console.log(e.target.value)
 * const handleChangeDeferred = PromisE.deferredCallback(handleChange, {
 *     delayMs: 300,
 *     throttle: false,
 * })
 * // simulate click events call after prespecified delay
 * const delays = [
 *     100,
 *     150,
 *     200,
 *     550,
 *     580,
 *     600,
 *     1000,
 *     1100,
 * ]
 * delays.forEach(timeout =>
 *     setTimeout(() => handleChangeDeferred({
 *        target: { value: timeout }
 *     }), timeout)
 * )
 *
 *
 * // Prints:
 * // 200, 600, 1100
 * ```
 *
 * @example  Throttled event handler
 * ```typescript
 * const handleChange = (e: { target: { value: number }}) => console.log(e.target.value)
 * const handleChangeDeferred = PromisE.deferredCallback(handleChange, {
 *     delayMs: 300,
 *     throttle: true,
 * })
 * // simulate click events call after prespecified delay
 * const delays = [
 *     100,
 *     150,
 *     200,
 *     550,
 *     580,
 *     600,
 *     1000,
 *     1100,
 * ]
 * delays.forEach(timeout =>
 *     setTimeout(() => handleChangeDeferred({
 *        target: { value: timeout }
 *     }), timeout)
 * )
 * // Prints: 100, 550, 1100
 * ```
 */
export function deferredCallback<
	TDefault,
	CbArgs extends unknown[] = unknown[],
>(
	callback: (...args: CbArgs) => TDefault | Promise<TDefault>,
	options: DeferredOptions = {},
) {
	const { thisArg } = options
	if (thisArg !== undefined) callback = callback.bind(thisArg)
	const deferPromise = deferred<TDefault>(options)

	return <TResult = TDefault>(...args: CbArgs) =>
		deferPromise(() => callback(...args) as IPromisE<TResult>)
}
export default deferredCallback
