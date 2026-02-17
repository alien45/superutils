import { fallbackIfFails, isFn, isPromise } from '@superutils/core'
import { PromiseParams, IPromisE, OnEarlyFinalize, OnFinalize } from './types'

export class PromisEBase<T = unknown>
	extends Promise<T>
	implements IPromisE<T>
{
	private _resolve: (value: T | PromiseLike<T>) => void
	private _reject: (reason: unknown) => void
	private _state: 0 | 1 | 2 = 0

	/**
	 * callbacks to be invoked whenever PromisE instance is finalized early using non-static resolve()/reject() methods */
	public onEarlyFinalize = [] as OnEarlyFinalize<T>[]
	public onFinalize = [] as OnFinalize<T>[]

	/** Create a PromisE instance as a drop-in replacement for Promise */
	constructor(...args: PromiseParams<T>)
	/** Extend an existing Promise instance to check status or finalize early */
	constructor(promise: Promise<T>)
	/** Create a resolved promise with value */
	constructor(value: T)
	/** Create a promise to be resolved externally using `.resolve()` and `.reject()` methods */
	constructor(value: undefined)
	/**
	 * If executor function is not provided, the promise must be resolved/rejected externally.
	 *
	 * @example
	 * #### An alternative to "Promise.withResolvers()"
	 * ```javascript
	 * import PromisE from '@superutils/promise'
	 *
	 * // create a promise that will NEVER finalize automatically
	 * const p = new PromisE()
	 * // resolve it manually
	 * setTimeout(() => p.resolve(1), 1000)
	 * p.then(console.log)
	 * ```
	 */
	constructor()
	constructor(input?: T | Promise<T> | PromiseParams<T>[0]) {
		let _resolve: (value: T | PromiseLike<T>) => void
		let _reject: (reason: unknown) => void
		super((resolve, reject) => {
			_reject = reason => {
				reject(reason)
				this._state = 2
				this.onFinalize.forEach(fn =>
					fallbackIfFails(fn, [undefined, reason], undefined),
				)
			}
			_resolve = value => {
				resolve(value)
				this._state = 1
				this.onFinalize.forEach(fn =>
					fallbackIfFails(fn, [value, undefined], undefined),
				)
			}

			if (isFn(input)) {
				fallbackIfFails(input, [_resolve, _reject], _reject)
			} else if (isPromise(input)) {
				input.then(_resolve, _reject)
			} else if (input !== undefined) {
				_resolve(input as T)
			}
			// If input is `undefined`, do nothing and expect external finalization.
		})

		this._resolve = _resolve!
		this._reject = _reject!
	}

	//
	//
	//-------------------- Status related read-only attributes --------------------
	//
	//

	/** Indicates if the promise is still pending/unfinalized */
	public get pending() {
		return this.state === 0
	}

	/** Indicates if the promise has been rejected */
	public get rejected() {
		return this.state === 2
	}

	/** Indicates if the promise has been resolved */
	public get resolved() {
		return this.state === 1
	}

	/**
	 * Get promise status code:
	 *
	 * - `0` = pending
	 * - `1` = resolved
	 * - `2` = rejected
	 */
	public get state() {
		return this._state
	}

	//
	//
	// --------------------------- Early resolve/reject ---------------------------
	//
	//

	/** Resovle pending promise early. */
	public resolve = (value: T | PromiseLike<T>) => {
		if (!this.pending) return

		this._resolve?.(value)
		this.onEarlyFinalize?.forEach(fn => {
			fallbackIfFails(fn, [true, value], undefined)
		})
	}

	/** Reject pending promise early. */
	public reject = (reason: unknown) => {
		if (!this.pending) return

		this._reject?.(reason)
		this.onEarlyFinalize?.forEach(fn => {
			fallbackIfFails(fn, [false, reason], undefined)
		})
	}

	//
	//
	// Extend all static `Promise` methods
	//
	//

	/** Sugar for `new PromisE(Promise.all(...))` */
	static all = <T extends unknown[]>(values: T) =>
		new PromisEBase(globalThis.Promise.all<T>(values)) as IPromisE<{
			-readonly [P in keyof T]: Awaited<T[P]>
		}>

	/** Sugar for `new PromisE(Promise.allSettled(...))` */
	static allSettled = <T extends unknown[]>(values: T) =>
		new PromisEBase(globalThis.Promise.allSettled<T>(values)) as IPromisE<
			PromiseSettledResult<Awaited<T[number]>>[]
		>

	/** Sugar for `new PromisE(Promise.any(...))` */
	static any = <T extends unknown[]>(values: T) =>
		new PromisEBase(globalThis.Promise.any<T>(values)) as IPromisE<
			Awaited<T[number]>
		>

	/** Sugar for `new PromisE(Promise.race(..))` */
	static race = <T extends unknown[]>(values: T) =>
		new PromisEBase(globalThis.Promise.race(values)) as IPromisE<
			Awaited<T[number]>
		>

	/** Extends Promise.reject */
	static reject = <T = never>(reason: unknown) => {
		const promise = new PromisEBase<T>()
		// queueMicrotask required to avoid unhandled rejection
		queueMicrotask(() => promise.reject(reason as Error))
		return promise
	}

	/** Sugar for `new PromisE(Promise.resolve(...))` */
	static resolve = <T>(value?: T | PromiseLike<T>) =>
		new PromisEBase<T>(
			globalThis.Promise.resolve<T>(value as T),
		) as IPromisE<T>

	/** Sugar for `new PromisE(Promise.try(...))` */
	static try = <T, U extends unknown[]>(
		callbackFn: (...args: U) => T | PromiseLike<T>,
		...args: U
	) =>
		new PromisEBase<T>(resolve =>
			resolve(
				// Promise.try is not supported in Node < 23.
				fallbackIfFails(
					callbackFn,
					args,
					// rethrow error to ensure the returned promise is rejected
					err => globalThis.Promise.reject(err as Error),
				),
			),
		) as IPromisE<Awaited<T>>

	/**
	 * Creates a `PromisE` instance and returns it in an object, along with its `resolve` and `reject` functions.
	 *
	 * NB: this function is technically no longer needed because the `PromisE` class already comes with the resolvers.
	 *
	 * ---
	 * @example
	 * Using `PromisE` directly: simply provide an empty function as the executor
	 *
	 * ```typescript
	 * import PromisE from '@superutils/promise'
	 * const promisE = new PromisE<number>(() => {})
	 * setTimeout(() => promisE.resolve(1), 1000)
	 * promisE.then(console.log)
	 * ```
	 *
	 * @example
	 * Using `withResolvers`
	 * ```typescript
	 * import PromisE from '@superutils/promise'
	 * const pwr = PromisE.withResolvers<number>()
	 * setTimeout(() => pwr.resolve(1), 1000)
	 * pwr.promise.then(console.log)
	 * ```
	 */
	static withResolvers = <T = unknown>() => {
		const promise = new PromisEBase<T>() as IPromisE<T>
		return { promise, reject: promise.reject, resolve: promise.resolve }
	}
}
export default PromisEBase
