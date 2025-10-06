import { fallbackIfFails, isPromise } from '@utiils/core'
import { OnEarlyFinalize, PromiseParams, IPromisE } from './types'

export class PromisEBase<T = unknown>
	extends Promise<T>
	implements IPromisE<T>
{
	public readonly state: 0 | 1 | 2 = 0
	private _resolve?: (value: T) => void
	private _reject?: (reason: any) => void

	/**
	 * callbacks to be invoked whenever PromisE instance is finalized early using non-static resolve()/reject() methods */
	public onEarlyFinalize: OnEarlyFinalize<T>[] = []

	/** Create a PromisE instance as a drop-in replacement for Promise */
	constructor(...args: PromiseParams<T>)
	/** Extend an existing Promise instance to check status or finalize early */
	constructor(promise: Promise<T>)
	/**
	 * If executor function is not provided, the promise must be resolved/rejected externally.
	 *
	 * ---
	 * @example ```typescript
	 * const p = new PromisE<number>()
	 * setTimeout(() => p.resolve(1), 1000)
	 * p.then(console.log)
	 * ```
	 */
	constructor()
	constructor(input: Promise<T> | PromiseParams<T>[0] = () => {}) {
		if (input instanceof PromisEBase) return input

		let _resolve: any, _reject: any
		super((resolve, reject) => {
			_reject = (reason: any) => {
				;(this as any).state = 2
				reject(reason)
			}
			_resolve = (value: T) => {
				;(this as any).state = 1
				resolve(value)
			}
			const promise = isPromise(input) ? input : new Promise<T>(input)
			promise.then(_resolve, _reject)
		})

		this._resolve = _resolve
		this._reject = _reject
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

	//
	//
	// --------------------------- Early resolve/reject ---------------------------
	//
	//

	/** Resovle pending promise early. */
	public resolve = (value: T) => {
		this.pending
			&& queueMicrotask(() => {
				this._resolve?.(value)
				this.onEarlyFinalize?.forEach(fn =>
					PromisEBase.try(fn, true, value),
				)
			})
		return this as IPromisE<T>
	}

	/** Reject pending promise early. */
	public reject = (reason: any) => {
		this.pending
			&& queueMicrotask(() => {
				this._reject?.(reason)
				this.onEarlyFinalize?.forEach(fn =>
					PromisEBase.try(fn, false, reason),
				)
			})
		return this as IPromisE<T>
	}

	//
	//
	// Extend all static `Promise` methods
	//
	//

	/** Sugar for `new PromisE(Promise.all(...))` */
	static all = <T extends readonly unknown[] | []>(values: T) =>
		new PromisEBase(Promise.all<T>(values)) as IPromisE<{
			-readonly [P in keyof T]: Awaited<T[P]>
		}>

	/** Sugar for `new PromisE(Promise.allSettled(...))` */
	static allSettled = <T extends unknown[]>(values: T) =>
		new PromisEBase(Promise.allSettled<T>(values)) as IPromisE<
			PromiseSettledResult<Awaited<T[number]>>[]
		>

	/** Sugar for `new PromisE(Promise.any(...))` */
	static any = <T extends unknown[]>(values: T) =>
		new PromisEBase(Promise.any<T>(values)) as IPromisE<T[number]>

	/** Sugar for `new PromisE(Promise.race(..))` */
	static race = <T>(values: T[]) =>
		new PromisEBase(Promise.race(values)) as IPromisE<Awaited<T>>

	/** Extends Promise.reject */
	static reject = <T = never>(reason: any) => {
		const { promise, reject } = PromisEBase.withResolvers<T>()
		queueMicrotask(() => reject(reason)) // required to avoid unhandled rejection
		return promise
	}

	/** Sugar for `new PromisE(Promise.resolve(...))` */
	static resolve = <T>(value?: T) =>
		new PromisEBase<T>(Promise.resolve<T>(value as T)) as IPromisE<T>

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
					err => Promise.reject(err),
				),
			),
		) as IPromisE<Awaited<T>>

	/**
	 * Creates a `PromisE` instance and returns it in an object, along with its `resolve` and `reject` functions.
	 *
	 * NB: this function is technically no longer needed because the `PromisE` class already comes with the resolvers.
	 *
	 * ---
	 *
	 *
	 * @example ```typescript
	 * // Using `PromisE` directly: simply provide an empty function as the executor
	 * const promisE = new PromisE<number>(() => {})
	 * setTimeout(() => promisE.resolve(1), 1000)
	 * promisE.then(console.log)
	 *
	 * // Using `withResolvers`
	 * const pwr = PromisE.withResolvers<number>()
	 * setTimeout(() => pwr.resolve(1), 1000)
	 * pwr.promise.then(console.log)
	 * ```
	 */
	static withResolvers = <T = unknown>() => {
		const pwr = Promise.withResolvers<T>()
		const promise = new PromisEBase<T>(pwr.promise) as IPromisE<T>
		return { ...pwr, promise }
	}
}
export default PromisEBase
