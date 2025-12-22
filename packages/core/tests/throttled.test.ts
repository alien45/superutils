import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { throttled } from '../src'

describe('throttled', () => {
	const delayMs = 100
	const delayMsX2 = delayMs * 2

	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should swallow errors and invoke onError if provided', () => {
		const bad = vi.fn(() => {
			throw 'boom'
		})
		const onError = vi.fn()
		const fn = throttled(bad, delayMs, { onError })
		expect(() => fn()).not.toThrow()
		fn()
		fn()
		fn()
		fn()
		vi.advanceTimersByTime(delayMsX2)
		expect(onError).toHaveBeenCalledTimes(1)
	})

	it('should bind thisArg correctly', () => {
		type ThisArg = { value: number }
		const cb = function (this: ThisArg) {}
		const viCb = vi.fn(cb)
		const obj = { value: 42 }
		throttled(
			viCb as typeof cb, // casting is required for "thisArg" type-safety which vi.fn() removes
			delayMs,
			{ thisArg: obj },
		)()
		vi.advanceTimersByTime(delayMsX2)
		const cbThisValue = viCb.mock.instances[0]
		expect(cbThisValue).toBe(obj)
	})

	it('should throttle the callback WITH trailing-edge execution', () => {
		const callback = vi.fn()
		const throttledFunc = throttled(
			callback,
			delayMs,
			{ trailing: true }, // enables trailing-edge
		)

		// series 1
		throttledFunc(1)
		throttledFunc(2)
		throttledFunc(3)
		throttledFunc(4)
		throttledFunc(5)
		vi.advanceTimersByTime(delayMsX2)
		expect(callback).toHaveBeenCalledTimes(2)
		expect(callback).toHaveBeenCalledWith(1)
		expect(callback).toHaveBeenLastCalledWith(5)

		// series 2
		throttledFunc(6)
		throttledFunc(7)
		vi.advanceTimersByTime(1)
		expect(callback).toHaveBeenLastCalledWith(6)
		expect(callback).not.toHaveBeenCalledTimes(7)
		throttledFunc(8)
		throttledFunc(9)
		throttledFunc(10)
		vi.advanceTimersByTime(delayMsX2)
		expect(callback).not.toHaveBeenCalledTimes(7)
		expect(callback).not.toHaveBeenCalledTimes(9)
		expect(callback).toHaveBeenLastCalledWith(10)
	})

	it('should throttle the callback WITHOUT trailing-edge execution', () => {
		const callback = vi.fn()
		const throttledFunc = throttled(
			callback,
			delayMs,
			{ trailing: false }, // disables trailing-edge
		)

		// series 1
		throttledFunc(1)
		vi.advanceTimersByTime(1)
		expect(callback).toHaveBeenLastCalledWith(1)
		throttledFunc(2)
		throttledFunc(3)
		throttledFunc(4)
		throttledFunc(5)

		vi.advanceTimersByTime(delayMsX2)
		expect(callback).toHaveBeenCalledExactlyOnceWith(1)

		// series 2
		vi.advanceTimersByTime(delayMsX2)
		throttledFunc(6)
		vi.advanceTimersByTime(1)
		expect(callback).toHaveBeenLastCalledWith(6)
		throttledFunc(7)
		throttledFunc(8)
		throttledFunc(9)
		throttledFunc(10)
		vi.advanceTimersByTime(delayMsX2)
		expect(callback).toHaveBeenCalledTimes(2)
		expect(callback).toHaveBeenLastCalledWith(6)
	})
})
