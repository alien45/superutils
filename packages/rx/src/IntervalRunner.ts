/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { fallbackIfFails, isFn, noop, TimeoutId } from '@superutils/core'
import { BehaviorSubject, Subscription } from 'rxjs'

/**
 * `onResult` callback signature for {@link IntervalRunner}
 *
 * @param error
 * @param result
 * @param runCount number times the task has been executed
 * @param once: if the task was executed outside of interval setup using `instance.executeOnce()` function.
 */
export type OnResultType<TResult = unknown> = (
	error: Error | null,
	result: TResult | undefined,
	runCount: number,
	once: boolean,
) => void | Promise<void>
/**
 * `onBeforeExecType` callback signature for {@link IntervalRunner}
 *
 * @param runCount number times the task has been executed
 * @param once: if the task was executed outside of interval setup using `instance.executeOnce()` function.
 */
export type onBeforeExecType = (
	runCount: number,
	once: boolean,
) => void | Promise<void>

/**
 * A simple runner to execute a task periodically.
 *
 * When to use `IntervalRunner` instead of `IntervalSubject`?
 *
 * `IntervalRunner` is useful when the execution of the `taskFn` (and its `onResult` callback)
 * needs to be precisely timed and/or excluded from the interval delay duration.
 *
 * @example
 * When an API call needs to be made periodically and there's a possibility of delayed response (due to network issues
 * or longer backend execution time). In this case, using IntervalRunner with `sequential = true` will ensure the
 * delay is consistent between completion of current and start of the next API call.
 *
 * @param	taskFn		task function to be executed periodically
 * @param	taskArgs	arguments (or a function that returns arguments) to be supplied to the task function.
 * @param	intervalMs	timer delay in milliseconds.
 * @param	sequential	true (default): will use setTimeout and will delay until execution is completed.
 * This will ensure, in case the current execution takes longer, the following execution will not occur until current one is done and the interval delay is passed.
 *
 * false: will use setInterval and the delay time to execute task will not affected. This may cause unwanted issues if the execution takes longer than the interval delay time. Use with caution.
 *
 * Default: `true`
 *
 * @param	preExecute	(optional) if true, will pre-execute task before starting the timer.
 *
 * Default: `true`
 *
 * @example
 * #### Execute a function sequentially
 * Counting time will not start until function execution ends, maintaining the delay between
 * end of execution consistent.
 * ```javascript
 * import fetch from '@superutils/fetch'
 * import { IntervalRunner } from '@superutils/rx'
 *
 * const runner = new IntervalRunner(
 *     fetch.get, // function to execute
 * 	   ['[DUMMYJSON-DOT-COM]/products'], // arguments to be provided to the function on each execution
 *     2000,
 *  )
 * runner.start(result => console.log({ result }))
 * ```
 *
 * @example
 * #### Execute a function without enforcing sequential completion
 * Timing begins at the start of the task, ensuring a consistent interval between the **start**
 * of each execution, regardless of when the task finishes.
 * ```javascript
 * import fetch from '@superutils/fetch'
 * import { IntervalRunner } from '@superutils/rx'
 *
 * // Create a interval runner that retrieves products every 2 seconds
 * const runner = new IntervalRunner(
 *   fetch.get,
 * 	 ['[DUMMYJSON-DOT-COM]/products'],
 *   2000,
 *   false,
 *  )
 * runner.start(result => console.log({ result }))
 * ```
 *
 * @example
 * #### Execute a function and auto-retry on failure
 * ```javascript
 * import fetch from '@superutils/fetch'
 * import { IntervalRunner } from '@superutils/rx'
 *
 * const runner = new IntervalRunner(
 *   () => retry(
 *     fetch.get, // function to execute
 *     { retry: 3 }, // retry maximum 3 times (max 5 attempts )
 *   ),
 * 	 ['[DUMMYJSON-DOT-COM]/products'], // arguments to be provided to the function on each execution
 *   2000,
 *  )
 * runner.start(result => console.log({ result }))
 * ```
 */
export class IntervalRunner<
	TResult = unknown,
	TArgs extends unknown[] = unknown[],
> {
	private idInterval: TimeoutId | undefined
	public lastResult: TResult | undefined
	public minIntervalMs = 1000
	private onBeforeExec?: onBeforeExecType
	private onResult: OnResultType<TResult> | undefined
	/**
	 * RxJS BehaviorSubject to change timer delay (and restart the timer) on the fly
	 */
	readonly intervalMs$: BehaviorSubject<number>
	private _runCount = 0
	private started = false
	private subscription: Subscription | undefined

	constructor(
		readonly taskFn: (...args: TArgs) => TResult | Promise<TResult>,
		readonly taskArgs:
			| TArgs
			| ((
					this: IntervalRunner<TResult, TArgs>,
					runCount: number,
			  ) => TArgs),
		intervalMs: BehaviorSubject<number> | number,
		readonly sequential = true, // If true, timer will start only after execution is finished.
		readonly preExecute = true, // false = delay >> execute, true = execute >> delay
	) {
		this.intervalMs$ =
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

		if (this.sequential || once) this.clearInterval()

		try {
			++this._runCount
			await this.onBeforeExec?.(this._runCount, once)
			result = await this.taskFn(
				...(isFn(this.taskArgs)
					? this.taskArgs.call(this, this._runCount)
					: this.taskArgs),
			)
			this.lastResult = result
		} catch (_err) {
			err = _err
		}

		fallbackIfFails(
			this.onResult,
			[(err as Error) ?? null, result, this._runCount, once],
			undefined,
		)

		if (
			!once
			&& this.sequential
			&& this.intervalMs$.value > this.minIntervalMs
		) {
			this.idInterval = setTimeout(
				this.executeTask,
				this.intervalMs$.value,
			)
		}
		return this.lastResult
	}

	/** Executes the task function once, regardless of the interval runner's current state. */
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

	/** Get number of times task has ran, excluding resets */
	get runCount() {
		return this._runCount
	}

	/**
	 * Sets the `onResult` and `onBeforeExec` callbacks and starts the interval execution.
	 *
	 * If the runner is already started, the new callbacks will be used for subsequent executions.
	 * To apply new callbacks immediately, call `stop()` first, then `start()`.
	 * In order to start using callbacks immediately, invoke the `intervalRunner.stop()` function first.
	 *
	 * @param onResult (optional) function to be invoked whenever the task is succefully executed. See {@link OnResultType}
	 *
	 * @returns {Boolean} indicates whether starting interveral waa successful
	 */
	start = (
		onResult?: OnResultType<TResult>,
		onBeforeExec?: onBeforeExecType,
	): boolean => {
		if (onResult) this.onResult = onResult
		if (onBeforeExec) this.onBeforeExec = onBeforeExec

		// already started, must stop using instance.stop() in order to re-start
		// New `onResult` & `onBeforeExec` will be used on next execution.
		if (this.started) return false

		this.started = true
		let delayMs: number
		this.subscription = this.intervalMs$.subscribe(newDelayMs => {
			// unchanged
			if (delayMs === newDelayMs && newDelayMs !== undefined) return

			delayMs = Math.max(newDelayMs ?? delayMs ?? 0, this.minIntervalMs)

			this.clearInterval()

			const preExec = this.lastResult === undefined && this.preExecute
			preExec && this.executeTask().catch(noop)

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
		if (resetRunCount) this._runCount = 0

		this.started = false
		this.subscription?.unsubscribe?.()

		this.clearInterval()
		return this
	}
}

export default IntervalRunner
