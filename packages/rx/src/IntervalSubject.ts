import { isBool, TimeoutId } from '@superutils/core'
import { BehaviorSubject } from 'rxjs'

export type IntervalSubjectOptions = {
	/** Whether to start the timer immediately. Default: `false` */
	autoStart?: boolean
	/** Interval duration in milliseconds. Default: `1000` */
	delayMs?: number
	/** Initial counter value. Default: `0` */
	initialValue?: number
	/** Number to increment the counter by. Default: `1` */
	incrementBy?: number
	/**
	 * Optional, callback invoked before every interval to determine whether timer should pause or continue running.
	 *
	 * If returns `true`, the counter will pause but the counter will remain unchanged.
	 *
	 * Default: `undefined`
	 */
	pauseIf?: (
		this: IntervalSubject,
		currentValue: number,
		nextValue: number,
	) => boolean
	/**
	 * Optional, callback invoked before every interval to determine whether timer should stop or continue running.
	 *
	 * If returns `true`, the counter will stop and reset to `0`.
	 *
	 * Default: `undefined`
	 */
	stopIf?: (
		this: IntervalSubject,
		currentValue: number,
		nextValue: number,
	) => boolean
}

/**
 * @summary	Extention of a BehaviorSubject with counter and interval function
 *
 * -----------------------------------------------
 *
 * @example
 * #### Fetch data from API server every minute
 * ```typescript
 * import fetch from '@superutils/fetch'
 * import { IntervalSubject } from '@superutils/rx'
 *
 * const initialValue = 0
 * const interval$ = new IntervalSubject({
 * 	autoStart: true,
 * 	delayMs: 60 * 1000, // interval delay. increment counter every "x" milliseconds
 *  initialValue, // initial counter value
 * 	incrementBy: 1, // increment by 1 at each interval
 * )
 *
 * const onChange = (counter: number) => {
 *   counter === initialValue && console.log('Counter started')
 *   fetch.get('[DUMMYJSON-DOT-COM]/http/200').then(
 *     () => console.log(new Date().toISOString(), 'Successful ping'),
 *     (err: Error) => console.log('Ping failed.', err)
 *   )
 * }
 *
 * // BehaviorSubject automatically resolves with the initial value if subscribed immediately.
 * // subscribe to the subject and execute `onChange`: first time immediately and then every 60 seconds
 * interval$.subscribe(onChange)
 * ```
 */
export class IntervalSubject extends BehaviorSubject<number> {
	private _intervalId: TimeoutId
	private _running = false

	public autoStart!: boolean
	private _delay!: number
	public incrementBy!: number
	public initialValue!: number
	public stopIf?: IntervalSubjectOptions['stopIf']
	public pauseIf?: IntervalSubjectOptions['pauseIf']

	constructor(optionsOrAutoStart = {} as IntervalSubjectOptions | boolean) {
		const {
			autoStart = false,
			delayMs = 1000,
			initialValue = 0,
			incrementBy = 1,
			pauseIf,
			stopIf,
		} = isBool(optionsOrAutoStart)
			? { autoStart: optionsOrAutoStart }
			: optionsOrAutoStart
		super(initialValue)

		this.autoStart = autoStart
		this._delay = delayMs
		this.incrementBy = incrementBy
		this.initialValue = initialValue
		this.pauseIf = pauseIf
		this.stopIf = stopIf
		this.autoStart && this.start()
	}

	get delay() {
		return this._delay
	}

	set delay(newDelay: number) {
		// ignore if interval is already running
		if (!this._running) this._delay = newDelay
	}

	get running() {
		return this._running
	}

	pause = () => {
		clearInterval(this._intervalId)

		this._running = false
		return this
	}

	resume = () => this.start()

	/** Start the counter if not already started */
	start = () => {
		if (!this._running) {
			this._running = true
			this._intervalId = setInterval(() => {
				const next = this.value + this.incrementBy
				const stop = this.stopIf?.call(this, this.value, next)
				if (stop === true) return this.stop()

				const pause = this.pauseIf?.call(this, this.value, next)
				if (pause === true) return this.pause()

				this.next(this.value + this.incrementBy)
			}, this._delay)
		}
		return this
	}

	/** Stops and resets the counter to the initial value */
	stop = () => {
		this.pause()
		this.next(this.initialValue)
		return this
	}
}
export default IntervalSubject
