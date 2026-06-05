import { BehaviorSubject } from 'rxjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import IntervalRunner from '../src/IntervalRunner'

describe('IntervalRunner', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.useRealTimers()
	})

	it('should execute the task immediately if preExecute is true', async () => {
		const task = vi.fn().mockResolvedValue('success')
		const onResult = vi.fn()
		const runner = new IntervalRunner(task, [], 2000, true, true)

		runner.start(onResult)

		// Should execute immediately because of preExecute
		await vi.advanceTimersByTimeAsync(1)
		expect(task).toHaveBeenCalledTimes(1)

		// Wait for the async execution and microtasks
		await vi.runOnlyPendingTimersAsync()
		expect(onResult).toHaveBeenCalledWith(null, 'success', 1, false)
	})

	it('should delay the first execution if preExecute is false', async () => {
		const task = vi.fn().mockResolvedValue('delayed')
		const onResult = vi.fn()
		const runner = new IntervalRunner(task, [], 2000, true, false)

		runner.start(onResult)

		expect(task).not.toHaveBeenCalled()

		await vi.advanceTimersByTimeAsync(2000)
		expect(task).toHaveBeenCalledTimes(1)
		expect(onResult).toHaveBeenCalledWith(null, 'delayed', 1, false)
	})

	it('should maintain sequential execution (delay starts after task finishes)', async () => {
		let resolveTask: (val: string) => void = () => {}
		const task = vi.fn().mockImplementation(
			() =>
				new Promise(resolve => {
					resolveTask = resolve
				}),
		)
		const onResult = vi.fn()
		// sequential = true
		const runner = new IntervalRunner(task, [], 2000, true, true)

		runner.start(onResult)
		await vi.runOnlyPendingTimersAsync()
		expect(task).toHaveBeenCalledTimes(1)

		// Advance time by the interval.
		// Since the first task hasn't resolved, the next timer shouldn't have started yet.
		await vi.advanceTimersByTimeAsync(2000)
		expect(task).toHaveBeenCalledTimes(1)

		// Resolve the first task
		resolveTask('done')
		await vi.runOnlyPendingTimersAsync()

		// Now that the task is finished, the 2000ms timer for the next run starts.
		await vi.advanceTimersByTimeAsync(2000)
		await vi.runOnlyPendingTimersAsync()
		expect(task).toHaveBeenCalledTimes(2)
	})

	it('should use setInterval when sequential is false', async () => {
		const task = vi.fn().mockResolvedValue('data')
		const onResult = vi.fn()
		// sequential = false, preExecute = false
		const runner = new IntervalRunner(task, [], 2000, false, false)

		runner.start(onResult)

		await vi.advanceTimersByTimeAsync(5000)
		// Should have triggered at 2000ms and 4000ms
		expect(task).toHaveBeenCalledTimes(2)
	})

	it('should update the interval dynamically via BehaviorSubject', async () => {
		const interval$ = new BehaviorSubject(undefined as unknown as number)
		const task = vi.fn().mockResolvedValue('ok')
		const runner = new IntervalRunner(task, [], interval$, true, false)

		runner.start(() => {})

		await vi.advanceTimersByTimeAsync(2000)
		expect(task).toHaveBeenCalledTimes(1)

		// Speed up the interval
		interval$.next(1100)

		await vi.advanceTimersByTimeAsync(1100)
		expect(task).toHaveBeenCalledTimes(2)

		interval$.next(1100) // should be ignored
		await vi.advanceTimersByTimeAsync(100)
		expect(task).toHaveBeenCalledTimes(2)
	})

	it('should stop execution when interval is below minIntervalMs', async () => {
		const interval$ = new BehaviorSubject(2000)
		const task = vi.fn().mockResolvedValue('ok')
		const runner = new IntervalRunner(task, [], interval$, true, false)
		runner.minIntervalMs = 1000

		runner.start(() => {})

		await vi.advanceTimersByTimeAsync(2000)
		expect(task).toHaveBeenCalledTimes(1)

		// Setting interval below or equal to minIntervalMs should trigger "exit" logic in start()
		interval$.next(500)

		await vi.advanceTimersByTimeAsync(5000)
		// Should only have executed one more time (the "exit" execution triggered by the subscription)
		expect(task).toHaveBeenCalledTimes(2)

		// Ensure no more timers are running
		expect(vi.getTimerCount()).toBe(0)
	})

	it('should handle task errors gracefully and continue running', async () => {
		const error = new Error('Task Failed')
		const task = vi
			.fn()
			.mockRejectedValueOnce(error)
			.mockResolvedValue('recovered')
		const onResult = vi.fn()

		const runner = new IntervalRunner(task, [], 2000, true, true)
		runner.start(onResult)

		await vi.runOnlyPendingTimersAsync()
		expect(onResult).toHaveBeenNthCalledWith(1, error, undefined, 1, false)

		// Should still schedule the next run despite the error
		await vi.advanceTimersByTimeAsync(2000)
		await vi.runOnlyPendingTimersAsync()
		expect(onResult).toHaveBeenNthCalledWith(2, null, 'recovered', 2, false)
	})

	it('should executeOnce regardless of the started state', async () => {
		const task = vi.fn().mockResolvedValue('once')
		const runner = new IntervalRunner(task, ['arg1'], 2000)

		const result = await runner.executeOnce()

		expect(task).toHaveBeenCalledWith('arg1')
		expect(result).toBe('once')
		expect(runner.isStarted()).toBe(false)
	})

	it('should stop the runner and reset run count if requested', async () => {
		const task = vi.fn().mockResolvedValue('val')
		const runner = new IntervalRunner(task, [], 2000, true, true)

		runner.start(() => {})
		await vi.runOnlyPendingTimersAsync()

		await vi.advanceTimersByTimeAsync(2000)
		await vi.runOnlyPendingTimersAsync()

		// Should have run twice
		runner.stop(true)

		expect(runner.isStarted()).toBe(false)
		expect(vi.getTimerCount()).toBe(0)

		// Restart and check run count starts from 1
		const onResult = vi.fn()
		runner.start(onResult)
		await vi.runOnlyPendingTimersAsync()
		expect(onResult).toHaveBeenCalledWith(null, 'val', 1, false)
	})

	it('should support restart() functionality', async () => {
		const task = vi.fn().mockResolvedValue('val')
		const runner = new IntervalRunner(task, [], 2000, true, true)
		const onResult = vi.fn()

		runner.start(onResult)
		expect(runner.restart(true)).toBe(true)

		await vi.runOnlyPendingTimersAsync()
		expect(onResult).toHaveBeenCalledWith(null, 'val', 1, false)
	})

	it('should execute onBeforeExec callback if provided', async () => {
		const onBeforeExec = vi.fn()
		const onResult = vi.fn()
		const task = vi.fn()
		const runner = new IntervalRunner(task, [], 1000)
		runner.start(onResult, onBeforeExec)

		await vi.advanceTimersByTimeAsync(1000)
		expect(onBeforeExec).toHaveBeenCalledTimes(1)
		expect(onResult).toHaveBeenCalledTimes(1)
	})

	it('should ignore start() call if onResult is not provided', async () => {
		const runner = new IntervalRunner(vi.fn(), [], 1000)
		expect(runner.start(null as any)).toBe(false)
	})

	it('should ignore subsequent start() calls if runner is already started and running', async () => {
		const runner = new IntervalRunner(vi.fn(), [], 1000)
		runner.start(() => {})
		expect(runner.start(() => {})).toBe(false)
	})

	it('should ignore restart if onResult is not provided', async () => {
		const runner = new IntervalRunner(vi.fn(), [], 1000)
		expect(runner.restart()).toBe(false)
	})
})
