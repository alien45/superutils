import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PromisE, { ResolveError, ResolveIgnored } from '../src'
import { getDeferredContext } from './getDeferredContext'

describe('PromisE.deferredCallback', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should bind callbacks to thisArg and invoke callbacks: onResult, onError & onIgnore callbacks', async () => {
		const context = getDeferredContext()
		context.delayMs = 100
		context.throttle = false
		context.resolveIgnored = ResolveIgnored.NEVER
		context.resolveError = ResolveError.REJECT
		const callback = (value: number) => {
			if (value === 3) return PromisE.delayReject(50, 'error' + value)
			return PromisE.delay(50, value)
		}

		const deferredCb = PromisE.deferredCallback(callback, context)
		/* 1 & 2 will be ignored, but will reject because `last` will reject when `ResolveIgnored.WITH_LAST` is used */
		deferredCb(1)
		deferredCb(2)
		await vi.advanceTimersByTimeAsync(200)
		deferredCb(3).catch(() => {})
		await vi.advanceTimersByTimeAsync(200)
		expect(context.data.errors.length).toBe(1)
		expect(context.data.ignored.length).toBe(1)
		expect(context.data.results.length).toBe(1)
	})

	it('should debounce/defer calls, sequentially executing the last of every series', async () => {
		const values: number[] = []
		type FakeEvent = { target: { value: number } }
		const handleChange = vi.fn((e: FakeEvent) =>
			values.push(e.target.value),
		)
		const handleChangeDeferred = PromisE.deferredCallback(handleChange, {
			delayMs: 300,
			throttle: false, // throttle with delay duration set in `defer`
		})
		// simulate click events by setting up triggers with specific delays
		const delays = [
			// series 1
			100, 150, 200,
			// series 2
			550, 580, 600,
			// series 3
			1000, 1100,
		]
		delays.forEach(value =>
			setTimeout(() => {
				handleChangeDeferred({
					target: { value },
				})
			}, value),
		)
		await vi.runAllTimersAsync()
		expect(values).toEqual([
			// series 1 result
			200,
			// series 2 result
			600,
			// series 3 result
			1100,
		])
	})
})
