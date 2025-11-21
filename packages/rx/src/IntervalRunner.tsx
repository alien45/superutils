/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { fallbackIfFails, TimeoutId } from '@superutils/core'
import { BehaviorSubject, Subscription } from 'rxjs'

export type OnResultType<TResult = unknown> = (
	error: Error | null,
	result: TResult | undefined,
	runCount: number,
	once: boolean,
) => void | Promise<void>
export type onBeforeExecType = (
	runCount: number,
	once: boolean,
) => void | Promise<unknown>

/**
 * @summary	a simple runner to execute a task periodically.
 *
 * When to use `IntervalRunner` instead of `IntervalSubject`?
 *
 * `IntervalRunner` is useful when the execution of the `onResult` time must be on the clock and/or must be excluded
 * from the interval delay duration.
 *
 * Example use case:
 * When an API call needs to be made periodically and there's a possibility of delayed response (due to network issues
 * or longer backend execution time). In this case, using IntervalRunner with `sequential = true` will ensure the
 * delay is consistent between completion of current and start of the next API call.
 *
 * @param	taskFn		task function to be executed periodically
 * @param	taskArgs	arguments to be supplied to the task function.
 * @param	intervalMs	timer delay in milliseconds.
 * @param	sequential	true (default): will use setTimeout and will delay until execution is completed.
 * This will ensure, in case the current execution takes longer, the following execution will not occur until current one is done and the interval delay is passed.
 *
 * false: will use setInterval and the delay time to execute task will not affected. This may cause unwanted issues if the execution takes longer than the interval delay time. Use with caution.
 *
 * @param	preExecute	(optional) if true, will pre-execute task before starting the timer.
 *
 * @example Execute a function sequentially
 * Will not start counting time until function execution ends, maintaining the delay betweeen execution consistent.
 * ```typescript
 * const runner = new IntervalRunner(
 *     PromisE.fetch,
 * 	   ['https://my-api-url.com/get-data'],
 *     2000,
 *  )
 * runner.start(result => console.log({ result }))
 * ```
 *
 * @example Execute a function at without enforcing sequential execution.
 * Will start counting time even if function execution is unfinied, maintaining the delay betweeen execution START-TIME consistent.
 * ```typescript
 * const runner = new IntervalRunner(
 *     PromisE.fetch,
 * 	   ['https://my-api-url.com/get-data'],
 *     2000,
 *     false,
 *  )
 * runner.start(result => console.log({ result }))
 * ```
 */
export default class IntervalRunner<
	TResult = unknown,
	TArgs extends unknown[] = unknown[],
> {
	private idInterval: TimeoutId | undefined
	public lastResult: TResult | undefined
	public minIntervalMs = 1000
	private onBeforeExec?: onBeforeExecType
	private onResult: OnResultType<TResult> | undefined
	/**
	 * @summary RxJS BehaviorSubject to change timer delay and restart the timer
	 */
	readonly rxIntervalMs: BehaviorSubject<number>
	private runCount = 0
	private started = false
	private subscription: Subscription | undefined

	constructor(
		readonly taskFn: (...args: TArgs) => TResult | Promise<TResult>,
		readonly taskArgs: TArgs,
		intervalMs: BehaviorSubject<number> | number,
		readonly sequential = true, // if true, timer will start start only after execution is finished
		readonly preExecute = true, // false = delay >> execute, true = execute >> delay
		// readonly deferStartMs = 100, // unused?
	) {
		this.rxIntervalMs =
			intervalMs instanceof BehaviorSubject
				? intervalMs
				: new BehaviorSubject(intervalMs)
	}

	private clearInterval = () => {
		this.sequential
			? clearTimeout(this.idInterval)
			: clearInterval(this.idInterval)
		this.idInterval = undefined
	}

	private executeTask = async (
		once = false,
	): Promise<TResult | undefined> => {
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

		fallbackIfFails(
			this.onResult,
			[(err as Error) ?? null, result, this.runCount, once],
			undefined,
		)

		if (this.sequential && this.rxIntervalMs.value > this.minIntervalMs) {
			this.idInterval = setTimeout(
				this.executeTask,
				this.rxIntervalMs.value,
			)
		}
		return this.lastResult
	}

	/** Execute the task function regardless of the intervar runner state */
	executeOnce = async (): Promise<TResult | undefined> =>
		await this.executeTask(true)

	/** Check if interval is running*/
	isStarted = () => this.started

	/**
	 * Restart interval
	 *
	 * @param resetRunCount (optional) whether to reset run count
	 *
	 * @returns {Boolean} indicates whether restart was successful
	 */
	restart = (resetRunCount = false): boolean => {
		if (!this.onResult) return false

		this.stop(resetRunCount)
		this.start(this.onResult, this.onBeforeExec)
		return true
	}

	/**
	 * @summary set `onResult` & `onBeforeExec` callbacks and start execution.
	 *
	 * If it's already running, the callbacks will be used on the next execution.
	 *
	 * In order to start using callbacks immediately, invoke the `intervalRunner.stop()` function first.
	 *
	 * @returns {Boolean} indicates whether starting interveral waa successful
	 */
	start = (
		onResult: OnResultType<TResult>,
		onBeforeExec?: onBeforeExecType,
	): boolean => {
		if (!onResult) return false

		this.onResult = onResult
		this.onBeforeExec = onBeforeExec

		// already started, must stop using instance.stop() in order to re-start
		// new `onResult` & `onBeforeExec` will be used on next execution
		if (this.started) return false

		this.started = true
		let delayMs: number
		this.subscription = this.rxIntervalMs.subscribe(newDelayMs => {
			// unchanged
			if (delayMs !== undefined && delayMs === newDelayMs) return

			delayMs = newDelayMs
			this.clearInterval()

			const exit = delayMs <= this.minIntervalMs
			const preExec = this.lastResult === undefined && this.preExecute
			preExec
				&& this.executeTask(exit).catch(() => {
					/* nothing to do */
				})
			// turn off the runner and execute task only once
			if (exit) return

			this.idInterval = !this.sequential
				? setInterval(this.executeTask, delayMs)
				: !preExec
					? setTimeout(this.executeTask, delayMs)
					: undefined
		})

		return true
	}

	/**
	 * Stop interval runner
	 *
	 * @param	resetRunCount	(optional) whether to reset the run counter
	 */
	stop = (resetRunCount = false) => {
		if (resetRunCount) this.runCount = 0

		this.started = false
		this.subscription?.unsubscribe?.()

		this.clearInterval()
		return this
	}
}
