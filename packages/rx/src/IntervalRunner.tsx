import { BehaviorSubject, Subscription } from 'rxjs'
import IntervalSubject from './IntervalSubject'

export type OnResultType<TResult = unknown> = (
	error: Error | null,
	result: TResult | undefined,
	runCount: number,
	once: boolean
) => void
export type onBeforeExecType = ((runCount: number, once: boolean) => void | Promise<any>)

/**
 * @name	IntervalRunner
 * @summary	a simple runner to execute a task periodically.
 * 
 * @description When to use `IntervalRunner` instead of `IntervalSubject`?
 * 
 * `IntervalRunner` is useful when the execution of the `onResult` time must be on the clock and/or must be considered 
 * but excluded from the interval delay/duration.
 * 
 * Example use case: 
 * When an API call needs to be made periodically and there's a possibility of delayed response (due to network issues or 
 * longer backend execution time). In this case, using IntervalRunner with `sequential = true` will ensure the delay is 
 * consistent between completion of current and start of the next API call.
 * 
 * @param	{function}	taskFn		task function to be executed periodically
 * @param	{any[]}		taskArgs	arguments to be supplied to the task function.
 * @param	{number}	intervalMs	timer delay in milliseconds.
 * @param	{boolean}	sequential	true (default): will use setTimeout and will delay until execution is completed.
 * This will ensure, in case the current execution takes longer, the following execution will not occur until current one is done and the interval delay is passed.
 * 
 * false: will use setInterval and the delay time to execute task will not affected. This may cause unwanted issues if the execution takes longer than the interval delay time. Use with caution.
 * 									
 * @param	{boolean}	preExecute	if true, will pre-execute task before starting the timer.
 * 
 * @example ```javascript
 * 
 * const runner = new IntervalRunner(
 *     PromisE.fetch,
 * 	   ['https://my-api-url.com/get-data'],
 *     2000,
 *     true,
 *     true,
 *  )
 * runner.start(result => console.log({ result }))
 * ```
 */
export default class IntervalRunner<TResult = unknown> {
	private idInterval: NodeJS.Timeout | undefined
	public lastResult: TResult | undefined
	public minIntervalMs = 1000
	private onBeforeExec?: onBeforeExecType
	private onResult: OnResultType<TResult> | undefined
	/**
	 * @name	rxIntervalMs
	 * @summary RxJS BehaviorSubject to change timer delay and restart the timer
	 */
	readonly rxIntervalMs: BehaviorSubject<any>
	private runCount = 0
	private started = false
	private subscription: Subscription | undefined

	constructor(
		readonly taskFn: (...args: any[]) => TResult | Promise<TResult>,
		readonly taskArgs: any[] = [],
		intervalMs: BehaviorSubject<number> | number,
		readonly sequential = true, // if true, timer will start start only after execution is finished
		readonly preExecute = true, // false = delay >> execute, true = execute >> delay
		readonly deferStartMs = 100
	) {
		this.rxIntervalMs = intervalMs instanceof BehaviorSubject
			? intervalMs
			: new BehaviorSubject(intervalMs)
	}

	private clearInterval = () => {
		this.sequential
			? clearTimeout(this.idInterval)
			: clearInterval(this.idInterval)
		this.idInterval = undefined
	}

	private exec = async (once: boolean = false): Promise<TResult | undefined> => {
		let err: unknown
		let result: TResult | undefined

		clearTimeout(this.idInterval)
		try {
			++this.runCount
			await this.onBeforeExec?.(this.runCount, once)
			result = await this.taskFn.apply(undefined, this.taskArgs)
			this.lastResult = result
		} catch (_err) {
			err = _err
		}
		this.onResult?.(
			!err
				? null
				: err as Error,
			result,
			this.runCount,
			once
		)

		if (this.sequential && this.rxIntervalMs.value > this.minIntervalMs) {
			this.idInterval = setTimeout(this.exec, this.rxIntervalMs.value)
		}
		return this.lastResult
	}

	executeOnce = async (): Promise<TResult | undefined> => await this.exec(true)

	isStarted = () => this.started

	restart = (resetRunCount = false) => {
		if (!this.onResult) return false

		this.stop(resetRunCount)
		this.start(this.onResult, this.onBeforeExec)
		return true
	}

	/**
	 * @name	start
	 * @summary set `onResult` & `onBeforeExec` callbacks and start execution.
	 * 
	 * @description
	 * If it's already running, the callbacks will be used on the next execution.
	 * 
	 * In order to start using callbacks immediately, invoke the `intervalRunner.stop()` function first.
	 */
	start = (onResult: OnResultType<TResult>, onBeforeExec?: onBeforeExecType) => {
		if (!onResult) return

		this.onResult = onResult
		this.onBeforeExec = onBeforeExec

		// already started, must stop using instance.stop() in order to re-start
		// new `onResult` & `onBeforeExec` will be used on next execution
		if (this.started) return

		this.started = true
		let delayMs: number
		this.subscription = this.rxIntervalMs.subscribe(newDelayMs => {
			// unchanged
			if (delayMs !== undefined && delayMs === newDelayMs) return

			delayMs = newDelayMs
			this.clearInterval()

			const exit = delayMs <= this.minIntervalMs
			const preExec = this.lastResult === undefined && this.preExecute
			preExec && this.exec(exit)
			// turn off the runner and execute task only once
			if (exit) return

			this.idInterval = !this.sequential
				? setInterval(() => this.exec(), delayMs)
				: !preExec
					? setTimeout(() => this.exec(), delayMs)
					: undefined
		})
	}

	stop = (resetRunCount = false) => {
		if (resetRunCount) this.runCount = 0

		this.started = false
		this.subscription?.unsubscribe?.()

		this.clearInterval()
	}
}