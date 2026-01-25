import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { deferred, debounce } from '../src'

describe('debounce', () => {
	const delayMs = 100
	const delayMsX2 = delayMs * 2

	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should swallow errors', () => {
		const bad = vi.fn(() => {
			throw new Error('boom')
		})
		const dfn = deferred(bad, delayMs, { throttle: false })
		expect(() => dfn()).not.toThrow()
	})

	it('should bind thisArg correctly', () => {
		type ThisArg = { value: number }
		const cb = function (this: ThisArg) {}
		const viCb = vi.fn(cb)
		const obj = { value: 42 }
		debounce(
			viCb as typeof cb, // casting is required for "thisArg" type-safety which vi.fn() removes
			delayMs,
			{ thisArg: obj },
		)()
		vi.advanceTimersByTime(delayMsX2)
		const cbThisValue = viCb.mock.instances[0]
		expect(cbThisValue).toBe(obj)
	})

	it('should debounce the callback WIHTOUT leading-edge execution', () => {
		const callback = vi.fn()
		const delayedFunc = debounce(callback, delayMs, { leading: false })

		delayedFunc(1)
		delayedFunc(2)
		delayedFunc(3)
		delayedFunc(4)
		delayedFunc(5)

		vi.advanceTimersByTime(delayMsX2)
		expect(callback).toHaveBeenCalledExactlyOnceWith(5)
	})

	it('should debounce the callback WITH leading-edge execution', () => {
		const callback = vi.fn()
		const delayedFunc = debounce(callback, delayMs, { leading: true })

		delayedFunc(1)
		delayedFunc(2)
		delayedFunc(3)
		delayedFunc(4)
		delayedFunc(5)

		vi.advanceTimersByTime(delayMsX2)
		expect(callback).toHaveBeenCalledTimes(2)
		expect(callback).toHaveBeenCalledWith(1)
		expect(callback).not.toHaveBeenCalledWith(2)
		expect(callback).not.toHaveBeenCalledWith(3)
		expect(callback).not.toHaveBeenCalledWith(4)
		expect(callback).toHaveBeenLastCalledWith(5)
	})

	it('should debounce the callback WITH leading-edge global execution', () => {
		const callback = vi.fn()
		const delayedFunc = debounce(callback, delayMs, { leading: 'global' })

		delayedFunc(1)
		delayedFunc(2)
		delayedFunc(3)
		delayedFunc(4)
		delayedFunc(5)
		vi.advanceTimersByTime(delayMs)
		delayedFunc(6)
		delayedFunc(7)
		delayedFunc(8)
		delayedFunc(9)
		delayedFunc(10)
		vi.advanceTimersByTime(delayMsX2)
		expect(callback).toHaveBeenCalledTimes(3)
		expect(callback).toHaveBeenCalledWith(1)
		expect(callback).toHaveBeenCalledWith(5)
		expect(callback).toHaveBeenLastCalledWith(10)
	})
})
