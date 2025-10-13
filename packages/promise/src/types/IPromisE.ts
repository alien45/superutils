import { TimeoutId, ValueOrPromise } from '@superutils/core'

export interface IPromisE<T = unknown> extends Promise<T> {
	/** 0: pending, 1: resolved, 2: rejected */
	readonly state: 0 | 1 | 2

	/** callbacks to be invoked whenever PromisE instance is finalized early using non-static resolve/reject methods */
	onEarlyFinalize: OnEarlyFinalize<T>[]

	/** Indicates if the promise is still pending/unfinalized */
	readonly pending: boolean

	/** Reject pending promise early. */
	reject: (reason: unknown) => IPromisE<T>

	/** Indicates if the promise has been rejected */
	readonly rejected: boolean

	/** Resovle pending promise early. */
	resolve: (value: T) => IPromisE<T>

	/** Indicates if the promise has been resolved */
	readonly resolved: boolean
}

/* Describes a delay PromisE and it's additional properties. */
export interface IPromisE_Delay<T = unknown> extends IPromisE<T> {
	/**
	 * Caution: pausing will prevent the promise from resolving/rejeting automatically.
	 *
	 * In order to finalize the promise either the `resolve()` or the `reject()` method must be invoked manually.
	 *
	 * An never-finalized promise may cause memory leak and will leave it at the mercry of the garbage collector.
	 * Use `pause()` only if you are sure.
	 *
	 * ---
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
	 * ---
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
	 * ---
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
	timeoutId: TimeoutId
}

/**
 * Descibes a timeout PromisE and it's additional properties.
 */
export type IPromisE_Timeout<T = unknown> = IPromisE<T> & {
	/** Clearing the timeout will prevent it from timing out */
	clearTimeout: () => void
	/** The result/data promise. If more than one supplied in `args` result promise will be a combined `PromisE.all` */
	data: IPromisE<T>
	/** A shorthand getter to check if the promise has timed out. Same as `promise.timeout.rejected`. */
	readonly timedout: boolean
	/** The timeout promise */
	timeout: IPromisE_Delay<T>
}

export type OnEarlyFinalize<T> = <
	TResolved extends boolean,
	TValue = TResolved extends true ? T : unknown,
>(
	resolved: TResolved,
	resultOrReason: TValue,
) => ValueOrPromise<unknown>

export type PromiseParams<T = unknown> = ConstructorParameters<
	typeof Promise<T>
>
