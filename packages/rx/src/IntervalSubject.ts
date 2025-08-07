/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject } from './BehaviorSubject'

/**
 * @name	IntervalSubject
 * @summary	a simple interval runner subject
 * 
 * -----------------------------------------------
 * 
 * @example ```javascript
 * // Example 1: create a simple interval runner
 * const rxInterval = new IntervalSubject(
 * 	true, // auto-start
 * 	1000, // interval delay
 *  0, // initial counter value
 * 	1, // increment by 1 at each interval
 * )
 * // subscribe to the subject and do whatever at each interval
 * rxInterval.subscribe(counter => 
 * 	// Ignore at initial value.
 *  // The BehaviorSubject automatically resolves with the initial value if subscribed immediately
 * 	counter > 0 && console.log(
 * 		counter % 60 === 0
 * 			? 'Another minute passed by!'
 * 			: `${counter % 60}`.padStart(2, '0')
 * 		)
 * )
 * ```
 */
export class IntervalSubject extends BehaviorSubject<number> {
	private intervalId: any
	readonly running: boolean = false

	constructor(
		public autoStart: boolean,
		public delay: number = 1000,
		readonly initialValue: number = 0,
		public incrementBy = 1,
	) {
		super(initialValue)

		this.autoStart && this.start()
	}

	pause = () => {
		clearInterval(this.intervalId);

		this.setRunning(false)
		return this
	}

    resume = () => this.start()

	start = () => {
		if (!this.running) {
			this.setRunning(true)
			this.intervalId = setInterval(
				() => this.next(this.value + this.incrementBy),
				this.delay
			)
		}
		return this
	}

	private setRunning = (value = false) => (this as any).running = value

	stop = () => {
		this.pause()
		this.next(0)
		return this
	}
}

export default IntervalSubject