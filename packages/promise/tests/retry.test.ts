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
		const retry = 5
		const timestamps: Date[] = []
		const func = vi.fn(() => {
			timestamps.push(new Date())
		})
		const promise = PromisE.retry(func, {
			retryIf: () => true, // keep re-executing regardless of result/error
			retry, // execute total 6 times
			retryBackOff: 'exponential',
			retryDelay,
			retryDelayJitter: false,
			retryDelayJitterMax: undefined,
		})
		await vi.runAllTimersAsync()
		await expect(promise).resolves.toBe(undefined)
		expect(timestamps).toHaveLength(6)
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
})
