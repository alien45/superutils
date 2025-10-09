import PromisE_deferred from './deferred'
import { IPromisE, DeferredOptions } from './types'

/**
 * @returns deferred/throttled callback function
 *
 *
 * @example ```typescript
 * const handleChange = (e: { target: { value: number }}) => console.log(e.target.value)
 * const handleChangeDeferred = PromisE.deferredCallback(handleChange, {
 *     delayMs: 300,
 *     throttle: false, // throttle with delay duration set in `defer`
 * })
 * // simulate click event
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
 * // Result (defer: 300, throttle: true): uses throttled()
 * // 100, 550, 1100
 *
 * // Result (defer: 300, throttle: false): uses deferred()
 * // 200, 600, 1100
 * ```
 */
export function PromisE_deferredCallback<
	TDefault,
	CbArgs extends any[] = any[],
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
