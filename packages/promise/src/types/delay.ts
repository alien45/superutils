import { TimeoutId } from '@superutils/core'
import { IPromisE } from './PromisEBase'

/* Describes a delay PromisE and it's additional properties. */
export interface IPromisE_Delay<T = unknown> extends Promise<T>, IPromisE<T> {
	/**
	 * Caution: pausing will prevent the promise from resolving/rejeting automatically.
	 *
	 * In order to finalize the promise either the `resolve()` or the `reject()` method must be invoked manually.
	 *
	 * An never-finalized promise may cause memory leak and will leave it at the mercry of the garbage collector.
	 * Use `pause()` only if you are sure.
	 *
	 * @example
	 * ```typescript
	 * // Example 1: SAFE => no memory leak, because no reference to the promise is stored and no suspended code
	 * <button onClick={() => {
	 *     const promise = PromisE.delay(1000).then(... do stuff ....)
	 *     setTimeout(() => promise.pause(), 300)
	 * }}>Click Me</button>
	 * ```
	 *
	 * @example UNSAFE => potential memory leak, because of suspended code
	 * ```typescript
	 * <button onClick={() => {
	 *     const promise = PromisE.delay(1000)
	 *     setTimeout(() => promise.pause(), 300)
	 *     await promise // suspended code
	 *     //... do stuff ....
	 * }}>Click Me</button>
	 * ```
	 *
	 * @example UNSAFE => potential memory leak, because of preserved reference.
	 * ```typescript
	 * // Until the reference to promises is collected by the garbage collector,
	 * // reference to the unfinished promise will remain in memory.
	 * const promises = []
	 * <button onClick={() => {
	 *     const promise = PromisE.delay(1000)
	 *     setTimeout(() => promise.pause(), 300)
	 *     promises.push(promise)
	 * }}>Click Me</button>
	 * ```
	 */
	pause: () => void
	/** Timeout ID */
	timeoutId: TimeoutId
}
