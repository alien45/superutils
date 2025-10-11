import { BehaviorSubject } from './BehaviorSubject'

/**
 * @name	IntervalSubject
 * @summary	Extention of a BehaviorSubject with interval function
 *
 * -----------------------------------------------
 *
 * @example ```typescript
 * // Example 1: Fetch data from API server every minute
 * const initialValue = 0
 * const rxInterval = new IntervalSubject(
 * 	true, // auto-start
 * 	60 * 1000, // interval delay. increment counter every "x" milliseconds
 *  initialValue, // initial counter value
 * 	1, // increment by 1 at each interval
 * )
 *
 * const onChange = (counter: number) => {
 * 	counter === initialValue && console.log('Counter started')
 * 	const { PromisE } = require('@superutils/core')
 * 	PromisE.fetch('https://jsonplaceholder.typicode.com/todos/100').then(
 *         () => console.log(new Date().toISOString(), 'Successful ping'),
 *         (err: Error) => console.log('Ping failed.', err)
 *     )
 * }
 *
 * // BehaviorSubject automatically resolves with the initial value if subscribed immediately.
 * // subscribe to the subject and execute `onChange`: first time immediately and then every 60 seconds
 * rxInterval.subscribe(onChange)
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
		clearInterval(this.intervalId)

		this.setRunning(false)
		return this
	}

	resume = () => this.start()

	start = () => {
		if (!this.running) {
			this.setRunning(true)
			this.intervalId = setInterval(
				() => this.next(this.value + this.incrementBy),
				this.delay,
			)
		}
		return this
	}

	private setRunning = (value = false) => ((this as any).running = value)

	stop = () => {
		this.pause()
		this.next(0)
		return this
	}
}

export default IntervalSubject
