import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi
} from 'vitest'
import { fallbackIfFails } from './fallbackIfFails'

describe('fallbackIfFails', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })
	
	// Synchronous tests
	describe('synchronous', () => {
		it('should return the value of a successful sync function', () => {
			const syncFn = vi.fn((...args: number[]) => args.reduce((a, b) => a + b, 0))
			const args = [2, 3, 5]
			const result = fallbackIfFails(syncFn, args, 0)
			expect(syncFn).toHaveBeenCalledWith(...args)
			expect(result).toBe(10)
		})

		it('should return the fallback value if a sync function throws an error', () => {
			const fallbackValue = new Date().toISOString()
			const mockSyncFail = vi.fn(() => { throw new Error('sync error') })
			const result = fallbackIfFails(mockSyncFail, [], fallbackValue)
			expect(mockSyncFail).toThrow('sync error')
			expect(result).toBe(fallbackValue)
		})

		it('should execute the fallback function to get the value on sync failure', () => {
			const mockSyncFail = vi.fn(() => { throw new Error('sync error') })
			const fallbackFn = vi.fn(() => 'fallback from function')
			const result = fallbackIfFails(mockSyncFail, [], fallbackFn)
			expect(fallbackFn).toHaveBeenCalled()
			expect(result).toBe('fallback from function')
		})

		it('should accept args as a function for sync calls', () => {
			const syncFn = (a: number, b: number) => a + b
			const getArgs = vi.fn(() => [5, 6])
			const result = fallbackIfFails(syncFn, getArgs, 0)
			expect(getArgs).toHaveBeenCalled()
			expect(result).toBe(11)
		})
	})

	// Asynchronous tests
	describe('asynchronous', () => {
		let mockAsyncFail: ReturnType<typeof vi.fn>
		let fallbackFn: ReturnType<typeof vi.fn>
		const asyncErrMsg = 'async error'
		const fallbackValue = 'async fallback'
		beforeEach(() => {
			mockAsyncFail = vi.fn(async () => { throw new Error(asyncErrMsg) })
			fallbackFn = vi.fn(() => Promise.resolve(fallbackValue))

		})

		it('should return a promise that resolves with the value of a successful async function', async () => {
			const asyncFn = vi.fn(async (val: string) => `success: ${val}`)
			const result = await fallbackIfFails(asyncFn, ['test'], fallbackValue)
			expect(asyncFn).toHaveBeenCalledWith('test')
			expect(result).toBe('success: test')
		})

		it('should return a promise that resolves with the fallback value if an async function rejects', async () => {
			await expect(mockAsyncFail()).rejects.toThrow(asyncErrMsg)
			const result = await fallbackIfFails(mockAsyncFail, [true], fallbackValue)
			expect(result).toBe(fallbackValue)
		})

		it('should execute the async fallback function to get the value on async failure', async () => {
			const result = await fallbackIfFails(mockAsyncFail, [], fallbackFn)
			expect(fallbackFn).toHaveBeenCalled()
			expect(result).toBe(fallbackValue)
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
			const promise = new Promise((_, reject) =>
				setTimeout(() => reject('Promise Rejected'), 5000)
			)
			const resultPromise = fallbackIfFails(promise, [], 'fallback')
			// Advance fake timers so the setTimeout runs
			vi.runAllTimers()
			expect(await resultPromise).toBe('fallback')
		})
	})
})
