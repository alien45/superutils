/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject } from './BehaviorSubject'

/**
 * @name	IntervalSubject
 * @summary	
 */
export class IntervalSubject extends BehaviorSubject<number> {
	private intervalId: any
	constructor(
		readonly initialValue: number,
		public delay: number,
		public autoStart = true,
		public incrementBy = 1
	) {
		super(initialValue)
	}

	pause = () => {
		clearInterval(this.intervalId)
		return this
	}

    resume = () => this.start()

	start = () => {
		this.intervalId = setInterval(
			() => this.next(
				this.value + this.incrementBy
			),
			this.delay,
		)
		return this
	}

	stop = () => {
		this.pause()
		this.next(0)
		return this
	}
}

export default IntervalSubject