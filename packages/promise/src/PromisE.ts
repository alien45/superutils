import config from './config'
import PromisE_deferred from './deferred'
import PromisE_deferredCallback from './deferredCallback'
import PromisE_deferredFetch from './deferredFetch'
import PromisE_deferredPost from './deferredPost'
import PromisE_delay from './delay'
import PromisE_delayReject from './delayReject'
import PromisE_fetch from './fetch'
import PromisE_post from './post'
import PromisEBase from './PromisEBase'
import PromisE_timeout from './timeout'
import { ResolveIgnored } from './types'

/**
 * @class PromisE
 * @summary an attempt to solve the problem of Promise status (pending/resolved/rejected) not being easily accessible externally.
 *
 * For more example see static functions like `PromisE.deferred}, `PromisE.fetch}, `PromisE.timeout} etc.
 *
 * ---
 *
 * @example ```javascript
 * // Examples of how to use `PromisE`.
 *
 * // Example 1: As a drop-in replacement for `Promise` class
 * const p = new PromisE((resolve, reject) => resolve('done'))
 * console.log(
 *  p.pending, // Indicates if promise has finalized (resolved/rejected)
 *  p.resolved, // Indicates if the promise has resolved
 *  p.rejected // Indicates if the promise has rejected
 * )
 *
 * // Example 2: Extend an existing `Proimse` instance to check status
 * const instance = new Promise((resolve) => setTimeout(() => resolve(1), 1000))
 * const p = new PromisE(instance)
 * console.log(p.pending)
 *
 * // Example 3: Create a promise to be finalized externally (an alternative to `PromisE.withResolvers()`)
 * const p = new PromisE<number>()
 * setTimeout(() => p.resolve(1))
 * p.then(console.log)
 *
 * // Example 4. Invoke functions catching any error and wrapping the result in a PromisE instance
 * const p = PromisE.try(() => { throw new Error('I am a naughty function' ) })
 * p.catch(console.error)
 * ```
 */
export class PromisE<T = unknown> extends PromisEBase<T> {
	/** Global configuration */
	static config = config
	static deferred = PromisE_deferred
	static deferredCallback = PromisE_deferredCallback
	static deferredFetch = PromisE_deferredFetch
	static deferredPost = PromisE_deferredPost
	static delay = PromisE_delay
	static delayReject = PromisE_delayReject
	static fetchDeferred = this.deferredFetch
	static fetch = PromisE_fetch
	static post = PromisE_post
	static postDeferred = this.deferredPost
	static timeout = PromisE_timeout
}
export default PromisE
