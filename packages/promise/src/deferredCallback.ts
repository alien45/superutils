import PromisE_deferred from './deferred'
import { IPromisE, DeferredOptions } from './types'

/**
 * @returns deferred/throttled callback function
 *
 *
 * @example Debounce/deferred callback
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
 * @example  Throttled callback
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
export function PromisE_deferredCallback<
	TDefault,
	CbArgs extends unknown[] = unknown[],
>(
	callback: (...args: CbArgs) => TDefault | Promise<TDefault>,
	options: DeferredOptions = {},
) {
	const { thisArg } = options
	if (thisArg !== undefined) callback = callback.bind(thisArg)
	const deferPromise = PromisE_deferred<TDefault>(options)

	return <TResult = TDefault>(...args: CbArgs) =>
		deferPromise(() => callback(...args) as IPromisE<TResult>)
}
export default PromisE_deferredCallback
