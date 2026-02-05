import { ValueOrPromise } from '@superutils/core'
import PromisEBase from '../PromisEBase'
import type { IPromisE_Delay } from './delay'
import type { IPromisE } from './PromisEBase'

/**
 * Descibes a timeout PromisE and it's additional properties.
 */
export type IPromisE_Timeout<T = unknown> = IPromisE<T> & {
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
	TFunc extends keyof TimeoutFunc<T>,
	Values extends unknown[] = {
		-readonly [P in keyof T]: T[P] extends (
			...args: unknown[]
		) => infer ReturnType
			? ReturnType
			: T[P]
	},
> = Awaited<
	T['length'] extends 1 ? Values[0] : ReturnType<TimeoutFunc<Values>[TFunc]>
>

export type TimeoutFunc<T extends unknown[] = []> = {
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
	Func extends string = 'all',
> = {
	abortCtrl?: AbortController
	func?: T['length'] extends 0
		? // no values provided
			never
		: T['length'] extends 1
			? // only value
				never
			: Func
	/**
	 * Callback invoked when the promise is rejected due to an abort signal.
	 * Optionally, return an `Error` object to reject the promise with a custom error.
	 */
	onAbort?: () => ValueOrPromise<void | Error>
	/**
	 * Callback invoked when the promise times out.
	 * Optionally, return an `Error` object to reject the promise with a custom error.
	 */
	onTimeout?: () => ValueOrPromise<void | Error>
	signal?: AbortSignal
	timeout?: number
}

/** Default options for `PromisE.timeout()` */
export type TimeoutOptionsDefault = Required<
	Omit<TimeoutOptions<unknown[], keyof TimeoutFunc>, 'abortCtrl' | 'signal'>
>
