import deferred from './deferred'
import deferredCallback from './deferredCallback'
import delay from './delay'
import delayReject from './delayReject'
import PromisEBase from './PromisEBase'
import retry from './retry'
import timeout from './timeout'

/**
 * An attempt to solve the problem of Promise status (pending/resolved/rejected) not being easily accessible externally.
 *
 * For more example see static functions like `PromisE.deferred}, `PromisE.fetch}, `PromisE.timeout} etc.
 *
 *
 * @example
 * #### Example 1: As a drop-in replacement for Promise class
 * ```javascript
 * import PromisE from '@superutils/promise'
 *
 * const p = new PromisE((resolve, reject) => resolve('done'))
 * console.log(
 *  p.pending, // Indicates if promise has finalized (resolved/rejected)
 *  p.resolved, // Indicates if the promise has resolved
 *  p.rejected // Indicates if the promise has rejected
 * )
 * ```
 *
 * @example
 * #### Example 2: Extend an existing `Proimse` instance to check status
 * ```javascript
 * import PromisE from '@superutils/promise'
 *
 * const instance = new Promise((resolve) => setTimeout(() => resolve(1), 1000))
 * const p = new PromisE(instance)
 * console.log(p.pending) // true
 * setTimeout(() => console.log({
 *   pending: p.pending, // false
 *   rejected: p.rejected, // false
 *   resolved: p.resolved, // true
 * }), 1000)
 * ```
 *
 * @example
 * #### Example 3: Create a promise to be finalized externally (an alternative to "PromisE.withResolvers()")
 * ```javascript
 * import PromisE from '@superutils/promise'
 *
 * const p = new PromisE()
 * setTimeout(() => p.resolve(1))
 * p.then(console.log)
 * ```
 *
 * @example
 * #### Example 4. Invoke functions catching any error and wrapping the result in a PromisE instance
 * ```javascript
 * import PromisE from '@superutils/promise'
 *
 * const p = PromisE.try(() => { throw new Error('I am a naughty function' ) })
 * p.catch(console.error)
 * ```
 */
export class PromisE<T = unknown> extends PromisEBase<T> {
	static deferred = deferred

	static deferredCallback = deferredCallback

	static delay = delay

	static delayReject = delayReject

	static retry = retry

	static timeout = timeout
}
export default PromisE
