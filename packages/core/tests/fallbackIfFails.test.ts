import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fallbackIfFails, isStr } from '../src'

describe('fallbackIfFails', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	// Synchronous tests
	describe('synchronous', () => {
		it('should return the fallback value if a sync function throws an error', () => {
			const fallbackValue = new Date().toISOString()
			const mockSyncFail = vi.fn(() => {
				throw new Error('sync error')
			})
			const result = fallbackIfFails(mockSyncFail, [], fallbackValue)
			expect(mockSyncFail).toThrow('sync error')
			expect(result).toBe(fallbackValue)
		})

		it('should execute the fallback function to get the value on sync failure', () => {
			const mockSyncFail = vi.fn(() => {
				throw 'sync error'
			})
			const fallbackFn = vi.fn(() => 'fallback from function')
			const result = fallbackIfFails(mockSyncFail, [], fallbackFn)
			expect(fallbackFn).toHaveBeenCalled()
			expect(result).toBe('fallback from function')
		})

		it('should accept args as a function for sync calls', () => {
			const syncFn = (a: number, b: number) => a + b
			const getArgs = vi.fn(() => [5, 6] as Parameters<typeof syncFn>)
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
			mockAsyncFail = vi.fn(async () => {
				throw new Error(asyncErrMsg)
			})
			fallbackFn = vi.fn(() => Promise.resolve(fallbackValue))
		})

		it('should return a promise when input is an async function or a sync function that returns a promise', async () => {
			const asyncFn = vi.fn(async (val: string) => `success: ${val}`)
			const result = await fallbackIfFails(
				asyncFn,
				['test'],
				fallbackValue,
			)
			expect(asyncFn).toHaveBeenCalledWith('test')
			expect(result).toBe('success: test')

			const syncFnWPromise = vi.fn((val: string) =>
				Promise.resolve(`success: ${val}`),
			)
			const result2 = await fallbackIfFails(
				syncFnWPromise,
				['test'],
				fallbackValue,
			)
			expect(syncFnWPromise).toHaveBeenCalledWith('test')
			expect(result2).toBe('success: test')
		})

		it('should return a promise or value based on the return type of the input function', async () => {
			const hybridFn = <
				T extends string | number,
				TResult = T extends string ? string : Promise<string>,
			>(
				nameOrId: T,
			): TResult => {
				if (isStr(nameOrId)) return `Hello Mr ${nameOrId}` as TResult
				return Promise.resolve(`Hello Mr Async-${nameOrId}`) as TResult
			}

			const str = fallbackIfFails(hybridFn<string>, ['Sync'], '')
			expect(str).toBeTypeOf('string')
			expect(str).toBe('Hello Mr Sync')

			const strPromise = fallbackIfFails(hybridFn<number>, [1], '')
			expect(strPromise).toBeInstanceOf(Promise)
			await expect(strPromise).resolves.toBe('Hello Mr Async-1')
		})

		it('should return a promise that resolves with the fallback value if an async function/promise rejects', async () => {
			await expect(mockAsyncFail()).rejects.toThrow(asyncErrMsg)
			const result = await fallbackIfFails(
				mockAsyncFail,
				[true],
				fallbackValue,
			)
			expect(result).toBe(fallbackValue)
		})

		it('should execute the async fallback function to get the value on async failure', async () => {
			const result = await fallbackIfFails(mockAsyncFail, [], fallbackFn)
			expect(fallbackFn).toHaveBeenCalled()
			expect(result).toBe(fallbackValue)
		})

		it('should accept args as a function for async calls', async () => {
			const asyncFn = async (val: string) =>
				Promise.resolve(`success: ${val}`)
			const argsFn = () => ['async test'] as Parameters<typeof asyncFn>
			const result = await fallbackIfFails(asyncFn, argsFn, 'fallback')
			expect(result).toBe('success: async test')
		})
	})

	// Direct value/promise tests
	describe('direct value or promise', () => {
		it('should return the value if input a value (not a function or a promise)', () => {
			const result = fallbackIfFails(999, [], 0)
			expect(result).toBe(999)
		})

		it('should accept a promise and turn into an async function', async () => {
			const result = await fallbackIfFails(
				Promise.reject<string>('promise value'),
				[],
				'fallback',
			)
			expect(result).toBe('fallback')
		})

		it('should resolve with fallback value when the input promise rejects', async () => {
			const promise = new Promise<string>((_, reject) =>
				setTimeout(() => reject('Promise Rejected'), 5000),
			)
			const resultPromise = fallbackIfFails(promise, [], 'Fallback')
			vi.runAllTimers()
			await expect(resultPromise).resolves.toBe('Fallback')
		})
	})
})
