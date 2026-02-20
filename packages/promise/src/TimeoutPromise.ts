import { arrUnique, fallbackIfFails, isObj } from '@superutils/core'
import PromisEBase from './PromisEBase'
import type {
	IPromisE,
	IPromisE_Delay,
	IPromisE_Timeout,
	OnFinalize,
	TimeoutOptions,
} from './types'

/** Timeout duration (in milliseconds) used as a fallback when positive number is not provided to {@link timeout} */
export const TIMEOUT_FALLBACK = 10_000
/** Node.js setTimeout limit is 2147483647 (2^31-1). Larger values fire immediately. */
export const TIMEOUT_MAX = 2147483647

/** Utility class used by `PromisE.timeout()`. */
export class TimeoutPromise<T>
	extends PromisEBase<T>
	implements IPromisE_Timeout<T>
{
	public readonly data: IPromisE<T>
	public readonly options: TimeoutOptions
	public readonly timeout: IPromisE_Delay<T>
	public readonly started: Date = new Date()
	private _signals?: AbortSignal[]

	constructor(
		data: IPromisE<T>,
		timeout: IPromisE_Delay<T>,
		options: TimeoutOptions,
		_signals?: AbortSignal[],
	) {
		super(data)
		this.data = data
		this.options = isObj(options) ? options : {}
		this.timeout = timeout
		this._signals = _signals
		this._setup()
	}

	get abortCtrl() {
		return this.options.abortCtrl
	}

	get aborted() {
		return (
			this.rejected
			&& !this.timeout.rejected
			&& !!this._signals?.find(s => s?.aborted)
		)
	}

	cancelAbort() {
		this._signals?.forEach(signal =>
			signal?.removeEventListener(
				'abort',
				this._handleAbort as EventListener,
			),
		)
	}

	clearTimeout() {
		clearTimeout(this.timeout.timeoutId)
	}

	get timedout() {
		return this.rejected && this.timeout.rejected
	}

	private _setup = () => {
		this._signals = arrUnique(
			[this.options?.abortCtrl?.signal, this.options?.signal].filter(
				Boolean,
			),
		) as AbortSignal[]
		// if promise is finalized externally remove all listeners and clear timeout
		!this.onEarlyFinalize.includes(this._handleEarlyFinalize)
			&& this.onEarlyFinalize.push(this._handleEarlyFinalize)

		!this.onFinalize.includes(this._handleFinalize)
			&& this.onFinalize.push(this._handleFinalize)

		// listen to controller/signal events and reject when appropriate
		this._signals?.forEach(signal =>
			signal?.addEventListener(
				'abort',
				this._handleAbort as EventListener,
			),
		)
	}

	private _handleAbort = async () => {
		let err = await fallbackIfFails(this.options?.onAbort, [], undefined)
		err ??= new Error(
			`Aborted after ${new Date().getTime() - this.started.getTime()}ms`,
		)
		err.name ??= 'AbortError'
		this.reject(err)
	}

	private _handleEarlyFinalize = () => {
		this.options?.abortOnEarlyFinalize && this.options?.abortCtrl?.abort?.()
	}
	// cleanup after execution
	private _handleFinalize = ((_?: T, err?: Error) => {
		// remove all event listeners and timeouts
		this.cancelAbort()
		this.clearTimeout()
		if (!this.timeout.rejected && !this._signals?.find(x => x?.aborted))
			return
		// abort if abortCtrl provided
		this.options?.abortCtrl?.signal?.aborted === false
			&& this.options?.abortCtrl.abort(err)
	}) as OnFinalize<T>
}
export default TimeoutPromise
