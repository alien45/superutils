import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PromisE, { PromisEBase } from '../src'

describe('PromisE.retry', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	beforeEach(() => {
		vi.useFakeTimers()
	})

	it('should use global retry.defaults and throw error after attempting max retries', async () => {
		const _retry = PromisE.retry.defaults.retry
		// set global default retry count
		PromisE.retry.defaults.retry = 10

		const func = vi.fn(async () => {
			return Promise.reject(new Error('Even number'))
		})
		const promise = PromisE.retry(func, null as any)
		vi.runAllTimersAsync()
		let error: unknown
		await promise.catch(err => (error = err))
		expect(error).toEqual(new Error('Even number'))
		expect(func).toHaveBeenCalledTimes(PromisE.retry.defaults.retry + 1)
		PromisE.retry.defaults.retry = _retry
	})

	it('should attempt to re-execute a failed function', async () => {
		let count = 0
		const func = vi.fn(() => {
			// return count on 5th try (4th retry)
			if (++count < 5) throw new Error('Even number')
			return count
		})
		const promise = PromisE.retry(func, {
			retry: 5,
			retryBackOff: 'linear',
		})
		await vi.runAllTimersAsync()
		await expect(promise).resolves.toBe(5)
		expect(func).toHaveBeenCalledTimes(5)
	})

	it('should use "unknown error" if rejected without an error (`Promise.reject()`)', async () => {
		const fn = vi.fn(() => Promise.reject())
		const promise = PromisE.retry(fn, { retry: 0 })
		let error
		promise.catch(err => (error = err))
		await vi.runAllTimersAsync()
		expect(error).toEqual(new Error())
		expect(fn).toHaveBeenCalledTimes(1)
	})

	it('should attempt to re-execute a based on condition', async () => {
		let count = 0
		const func = vi.fn(() => ++count)
		const promise = PromisE.retry(func, {
			retryIf: (result = 0) => result < 9,
			retry: 10,
			retryBackOff: 'linear',
		})
		await vi.runAllTimersAsync()
		await expect(promise).resolves.toBe(9)
		expect(func).toHaveBeenCalledTimes(9)
	})

	it('should use exponential backoff delay', async () => {
		const retryDelay = 1000
		const retry = 5 // execute total 6 times
		const timestamps: Date[] = []
		const func = vi.fn(() => timestamps.push(new Date()))
		const promise = PromisE.retry(func, {
			retryIf: () => true, // keep re-executing regardless of result/error
			retry,
			retryBackOff: 'exponential',
			retryDelay,
			retryDelayJitter: false,
			retryDelayJitterMax: undefined,
		})
		await vi.runAllTimersAsync()
		await expect(promise).resolves.toBe(retry + 1)
		expect(timestamps).toHaveLength(retry + 1)
		// delays between execution
		const arrDelays = timestamps
			.map((d, i) => {
				if (i === 0) return 0
				return d.getTime() - timestamps[i - 1].getTime()
			})
			.slice(1) // excluding first item that didn't have any delay before execution
		// check if every subsequent delay is 2X from it's predecessor
		const isExponential = arrDelays.every(
			(delay, i, arr) => i === 0 || delay >= arr[i - 1] * 2,
		)
		expect(isExponential).toBe(true)
	})

	it('should return an instance of PromisEBase and stop retrying on earlyFinazlie', async () => {
		const promise = PromisE.retry<number>(() => PromisE.delayReject(1000), {
			retry: 5,
		})
		promise.resolve(0)
		expect(promise).instanceOf(PromisEBase)
		await vi.advanceTimersByTimeAsync(1100)
		await vi.advanceTimersByTimeAsync(1100)
		await vi.runAllTimersAsync()
		await expect(promise).resolves.toBe(0)
	})

	it('should avoid circular referencing if `globalThis.Promise` is set to `PromisE`', async () => {
		const PromiseOriginal = globalThis.Promise
		globalThis.Promise = PromisE

		await expect(() => new Promise(r => r(true))).not.toThrow()
		await expect(() => Promise.resolve(true)).not.toThrow()
		globalThis.Promise = PromiseOriginal
	})

	it('should retry without delay', async () => {
		let count = 0
		const fn = vi.fn(() => {
			if (++count % 2 !== 0) throw new Error('Odd number')
			return count
		})
		const promise = PromisE.retry(fn, { retryDelay: 0 })
		await vi.advanceTimersByTimeAsync(1)
		await expect(promise).resolves.toBe(2)
		expect(fn).toHaveBeenCalledTimes(2)
	})
})
