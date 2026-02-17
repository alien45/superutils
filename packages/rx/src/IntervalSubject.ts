import { TimeoutId } from '@superutils/core'
import { BehaviorSubject } from './BehaviorSubject'

/**
 * @summary	Extention of a BehaviorSubject with interval function
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
 * const rxInterval = new IntervalSubject(
 * 	true, // auto-start
 * 	60 * 1000, // interval delay. increment counter every "x" milliseconds
 *  initialValue, // initial counter value
 * 	1, // increment by 1 at each interval
 * )
 *
 * const onChange = (counter: number) => {
 *   counter === initialValue && console.log('Counter started')
 *   fetch.get('https://dummyjson.com/http/200').then(
 *     () => console.log(new Date().toISOString(), 'Successful ping'),
 *     (err: Error) => console.log('Ping failed.', err)
 *   )
 * }
 *
 * // BehaviorSubject automatically resolves with the initial value if subscribed immediately.
 * // subscribe to the subject and execute `onChange`: first time immediately and then every 60 seconds
 * rxInterval.subscribe(onChange)
 * ```
 */
export class IntervalSubject extends BehaviorSubject<number> {
	private _intervalId: TimeoutId
	private _running = false

	constructor(
		public autoStart: boolean,
		private _delay = 1000,
		readonly initialValue = 0,
		public incrementBy = 1,
	) {
		super(initialValue)
		this.autoStart && this.start()
	}

	get delay() {
		return this._delay
	}

	set delay(newDelay: number) {
		// ignore if interval is alreay running
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

	start = () => {
		if (!this.running) {
			this._running = true
			this._intervalId = setInterval(
				() => this.next(this.value + this.incrementBy),
				this._delay,
			)
		}
		return this
	}

	stop = () => {
		this.pause()
		this.next(0)
		return this
	}
}

export default IntervalSubject
