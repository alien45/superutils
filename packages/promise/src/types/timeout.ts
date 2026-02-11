import { ValueOrPromise } from '@superutils/core'
import PromisEBase from '../PromisEBase'
import type { IPromisE_Delay } from './delay'
import type { IPromisE } from './PromisEBase'

/**
 * Descibes a timeout PromisE and it's additional properties.
 */
export type IPromisE_Timeout<T = unknown> = IPromisE<T> & {
	readonly abortCtrl?: AbortController
	/** Read-only property indicating if the promise rejected because of external abort. */
	readonly aborted: boolean
	/**
	 * Removes `abortCtrl/signal` listeners, effectively disabling external cancellation via AbortController.
	 */
	cancelAbort: () => void
	/**
	 * Clears the timeout timer, preventing the promise from being rejected due to a timeout.
	 */
	clearTimeout: () => void
	/** The underlying data promise. If multiple promises were passed to `timeout`, this represents the combined result (defaulting to `PromisE.all`). */
	data: IPromisE<T>
	/** Read-only property indicating if the promise timed out. Equivalent to checking `promise.timeout.rejected`. */
	readonly timedout: boolean
	/** The internal promise that handles the timeout logic. It rejects when the duration expires. */
	timeout: IPromisE_Delay<T>
}

export type TimeoutResult<
	T extends unknown[],
	BatchFunc extends keyof BatchFuncs<T>,
	Values extends unknown[] = {
		-readonly [P in keyof T]: T[P] extends (
			...args: unknown[]
		) => infer ReturnType
			? ReturnType
			: T[P]
	},
> = Awaited<
	T['length'] extends 1
		? Values[0]
		: ReturnType<BatchFuncs<Values>[BatchFunc]>
>

/** Suported function names for batch operations */
export type BatchFuncs<T extends unknown[] = []> = {
	all: typeof PromisEBase.all<T>
	allSettled: typeof PromisEBase.allSettled<T>
	any: typeof PromisEBase.any<T>
	race: typeof PromisEBase.race<T>
}

/**
 * Options for `PromisE.timeout()`
 *
 * @param func (optional) name of the supported `PromiEBase` static method to be used to resolve
 * when more than one promise/function is provided. Default: `"all"`
 * @param timeout (optional) timeout duration in milliseconds. Default: `10_000` (10 seconds)
 *
 */
export type TimeoutOptions<
	T extends unknown[] = [],
	BatchFuncName extends string = 'all',
> = {
	/**
	 * An `AbortController` instance.
	 *
	 * If provided:
	 * - It will be aborted automatically when the timeout occurs.
	 * - If it is aborted externally, the promise will be rejected and the timeout will be cleared.
	 */
	abortCtrl?: AbortController
	/**
	 * Whether to call `abortCtrl.abort()` if the promise is finalized externally
	 * (resolved or rejected before timeout or abort).
	 *
	 * Default: `true`
	 */
	abortOnEarlyFinalize?: boolean
	/**
	 * The name of the `PromisEBase` static method to use for resolving multiple promises/functions.
	 *
	 * Only applicable when more than one promise/function is provided.
	 */
	batchFunc?: T['length'] extends 0
		? // no values provided
			never
		: T['length'] extends 1
			? // only value
				never
			: BatchFuncName
	/**
	 * Callback invoked when the promise is rejected due to an abort signal.
	 *
	 * Can be used to transform the abort error by returning a custom `Error` object.
	 */
	onAbort?: () => ValueOrPromise<void | Error>
	/**
	 * Callback invoked when the promise times out.
	 *
	 * Can be used to transform the timeout error by returning a custom `Error` object.
	 */
	onTimeout?: () => ValueOrPromise<void | Error>
	/**
	 * An `AbortSignal` to listen to.
	 *
	 * If aborted:
	 * - The promise will be rejected.
	 * - The `abortCtrl` (if provided and distinct) will be aborted.
	 * - The timeout will be cleared.
	 */
	signal?: AbortSignal
	/** Timeout duration in milliseconds. */
	timeout?: number
}

/** Default options for `PromisE.timeout()` */
export type TimeoutOptionsDefault = Required<
	Omit<TimeoutOptions<unknown[], keyof BatchFuncs>, 'abortCtrl' | 'signal'>
>
