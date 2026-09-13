import { fallbackIfFails, isFn, isPromise } from '@superutils/core'
import { Promise } from './types'
import type { PromiseParams, IPromisE } from './types'

export class PromisEBase<T = unknown>
	extends Promise<T>
	implements IPromisE<T>
{
	/** Callbacks to be invoked whenever promise is finalized externally using `resolve()`/`reject()` methods */
	public onEarlyFinalize = [] as IPromisE<T>['onEarlyFinalize']

	/** Callback to be invoked after promise is resolved or rejected */
	public onFinalize = [] as IPromisE<T>['onFinalize']

	/** Early finalize by force rejecting a pending promise */
	public reject!: IPromisE<T>['reject']

	/** Early finalize by force resolving a pending promise */
	public resolve!: IPromisE<T>['resolve']

	/**
	 * Get promise status code:
	 *
	 * - `0` = pending
	 * - `1` = resolved
	 * - `2` = rejected
	 */
	readonly state: IPromisE['state'] = 0

	/** Create a `PromisE` instance as a drop-in replacement for `Promise` */
	constructor(...args: PromiseParams<T>)
	/** Extend an existing Promise instance to check status or finalize early */
	constructor(promise: Promise<T>)
	/** Create a resolved promise with value */
	constructor(value: T)
	/** Create a promise to be resolved externally using `.resolve()` and `.reject()` methods */
	constructor(value: undefined)
	/**
	 * Create a new promise to be resolved/rejected externally.
	 *
	 * #### Caution: If not resolved externally using `.resolve()` or `.reject()`. it will remain pending indefinitely.
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
		let _resolve: IPromisE<T>['resolve']
		let _reject: IPromisE<T>['reject']
		let superCalled = false

		const finalize = (
			valOrErr: unknown, // value or reason
			resolve = false,
			early = false,
		) => {
			if (!superCalled)
				return queueMicrotask(() => finalize(valOrErr, resolve, early))

			// promise has already been finalized
			if (!this.pending) return

			const finalizer = resolve ? _resolve : _reject
			finalizer(valOrErr as T)
			;(this.state as unknown) = resolve ? 1 : 2

			this.onFinalize?.forEach(fn =>
				fallbackIfFails(
					fn,
					resolve
						? [valOrErr as T, undefined]
						: [undefined, valOrErr],
					null,
				),
			)

			early
				&& this.onEarlyFinalize.forEach(fn =>
					fallbackIfFails(fn, [resolve, valOrErr], null),
				)
		}

		super((resolve, reject) => {
			_reject = reject
			_resolve = resolve

			if (isFn(input)) {
				fallbackIfFails(
					input,
					[v => finalize(v, true), finalize],
					finalize,
				)
			} else if (isPromise(input)) {
				input.then(v => finalize(v, true), finalize)
			} else if (input !== undefined) {
				// value provided to be resolved immediately
				finalize(input, true)
			}
			// If input is `undefined`, do nothing and expect external finalization.
		})

		superCalled = true

		this.reject = reason => finalize(reason, false, true)
		this.resolve = value => finalize(value, true, true)
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
	// Extend all static `Promise` methods
	//
	//

	/** Sugar for `new PromisE(Promise.all(...))` */
	static all = <T extends unknown[]>(values: T) =>
		new PromisEBase(Promise.all<T>(values)) as PromisEBase<{
			-readonly [P in keyof T]: Awaited<T[P]>
		}>

	/** Sugar for `new PromisE(Promise.allSettled(...))` */
	static allSettled = <T extends unknown[]>(values: T) =>
		new PromisEBase(Promise.allSettled<T>(values)) as PromisEBase<
			PromiseSettledResult<Awaited<T[number]>>[]
		>

	/** Sugar for `new PromisE(Promise.any(...))` */
	static any = <T extends unknown[]>(values: T) =>
		new PromisEBase(Promise.any<T>(values)) as PromisEBase<
			Awaited<T[number]>
		>

	/** Sugar for `new PromisE(Promise.race(..))` */
	static race = <T extends unknown[]>(values: T) =>
		new PromisEBase(Promise.race(values)) as PromisEBase<Awaited<T[number]>>

	/** Extends Promise.reject */
	static reject = <T = never>(reason: unknown) => {
		const promise = new PromisEBase<T>()
		// queueMicrotask required to avoid unhandled rejection
		// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
		queueMicrotask(() => promise.reject(reason))
		return promise
	}

	/** Sugar for `new PromisE(Promise.resolve(...))` */
	static resolve = <T>(value?: T | PromiseLike<T>) =>
		new PromisEBase<T>(Promise.resolve<T>(value as T)) as PromisEBase<T>

	/** Sugar for `new PromisE(Promise.try(...))` */
	static try = <T, U extends unknown[] = []>(
		callbackFn: (...args: U) => T | PromiseLike<T>,
		...args: U
	) =>
		// Promise.try is not supported in Node < 23.
		new PromisEBase<T>(
			fallbackIfFails(
				callbackFn,
				args,
				// rethrow error to ensure the returned promise is rejected
				(err: unknown) => PromisEBase.reject(err),
			),
		) as PromisEBase<Awaited<T>>

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
		const promise = new PromisEBase<T>() as PromisEBase<T>
		return { promise, reject: promise.reject, resolve: promise.resolve }
	}
}
export default PromisEBase
