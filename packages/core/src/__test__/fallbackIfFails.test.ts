import {
	describe,
	expect,
	it,
	vi
} from 'vitest'
import { fallbackIfFails } from '../fallbackIfFails'

describe('fallbackIfFails', () => {
	// Synchronous tests
	describe('synchronous', () => {
		it('should return the value of a successful sync function', () => {
			const syncFn = (...args: number[]) => args.reduce((a, b) => a + b, 0)
			const result = fallbackIfFails(syncFn, [2, 3, 5], 0)
			expect(result).toBe(10)
		})

		it('should return the fallback value if a sync function throws an error', () => {
			const failingFn = () => {
				throw new Error('Sync Error')
			}
			const result = fallbackIfFails(failingFn, [], 'fallback')
			expect(result).toBe('fallback')
		})

		it('should execute the fallback function to get the value on sync failure', () => {
			const failingFn = () => {
				throw new Error('Sync Error')
			}
			const fallbackFn = vi.fn(() => 'fallback from function')
			const result = fallbackIfFails(failingFn, [], fallbackFn)
			expect(fallbackFn).toHaveBeenCalled()
			expect(result).toBe('fallback from function')
		})

		it('should accept args as a function for sync calls', () => {
			const syncFn = (a: number, b: number) => a + b
			const argsFn = vi.fn(() => [5, 6])
			const result = fallbackIfFails(syncFn, argsFn, 0)
			expect(argsFn).toHaveBeenCalled()
			expect(result).toBe(11)
		})
	})

	// Asynchronous tests
	describe('asynchronous', () => {
		it('should return a promise that resolves with the value of a successful async function', async () => {
			const asyncFn = async (val: string) => Promise.resolve(`success: ${val}`)
			const result = await fallbackIfFails(asyncFn, ['test'], 'fallback')
			expect(result).toBe('success: test')
		})

		it('should return a promise that resolves with the fallback value if an async function rejects', async () => {
			const rejectingFn = async (shouldFail = true) => {
				if (shouldFail) throw new Error('Async Error')
				return 'success'
			}
			const result = await fallbackIfFails(rejectingFn, [true], 'fallback')
			expect(result).toBe('fallback')
		})

		it('should execute the async fallback function to get the value on async failure', async () => {
			const rejectingFn = () => Promise.reject('Async Error')
			const fallbackFn = vi.fn(async () => Promise.resolve('async fallback'))
			const result = await fallbackIfFails(rejectingFn, [], fallbackFn)
			expect(fallbackFn).toHaveBeenCalled()
			expect(result).toBe('async fallback')
		})

		it('should accept args as a function for async calls', async () => {
			const asyncFn = async (val: string) => Promise.resolve(`success: ${val}`)
			const argsFn = () => ['async test']
			const result = await fallbackIfFails(asyncFn, argsFn, 'fallback')
			expect(result).toBe('success: async test')
		})
	})

	// Direct value/promise tests
	describe('direct value or promise', () => {
		it('should return the value directly if target is not a function', () => {
			const result = fallbackIfFails('direct value', [], 'fallback')
			expect(result).toBe('direct value')
		})

		it('should return a resolving promise directly if target is a promise', async () => {
			const promise = Promise.resolve('promise value')
			const result = await fallbackIfFails(promise, [], 'fallback')
			expect(result).toBe('promise value')
		})

		it('should return a promise that resolves with the fallback value if target is a rejecting promise', async () => {
			const promise = new Promise(
				(_, reject) => 
					setTimeout(() => reject('Promise Rejected'), 1)
			)
			const result = await fallbackIfFails(promise, [], 'fallback')
			expect(result).toBe('fallback')
		})
	})
})
