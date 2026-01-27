import PromisEBase from '../PromisEBase'
import { IPromisE_Delay } from './delay'
import { IPromisE } from './PromisEBase'

/**
 * Descibes a timeout PromisE and it's additional properties.
 */
export type IPromisE_Timeout<T = unknown> = IPromisE<T> & {
	readonly aborted: boolean
	/**
	 * Removes event listeners attached to the abort signal, effectively disabling external cancellation via AbortController.
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

export type TimeoutFunc<T extends unknown[] = []> = {
	all: typeof PromisEBase.all<T>
	allSettled: typeof PromisEBase.allSettled<T>
	any: typeof PromisEBase.any<T>
	race: typeof PromisEBase.race<T>
}

/**
 * `PromisE.timeout` options
 *
 * @param func (optional) name of the supported `PromiEBase` static method to be used to resolve
 * when more than one promise/function is provided. Default: `"all"`
 * @param timeout (optional) timeout duration in milliseconds. Default: `10_000` (10 seconds)
 * @param timeoutMsg (optional) timeout error message. Default: `"Timed out after 10000ms"`
 *
 */
export type TimeoutOptions<
	T extends unknown[] = [],
	Func extends string = 'all',
> = {
	abortCtrl?: AbortController
	abortMsg?: string
	func?: T['length'] extends 0 ? never : T['length'] extends 1 ? never : Func
	signal?: AbortSignal
	timeout?: number
	timeoutMsg?: string
}
