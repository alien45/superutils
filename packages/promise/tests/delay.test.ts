import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PromisE from '../src'

describe('PromisE.delay', () => {
	afterEach(() => {
		vi.useRealTimers()
	})
	beforeEach(() => {
		vi.useFakeTimers()
	})

	it('should resolve immediately when invalid duration provided', async () => {
		const promise = PromisE.delay(null as any, 0)
		await vi.advanceTimersByTime(1)
		expect(promise.resolved).toBe(true)
	})

	it('should create a promise that resolves after predefined delay', async () => {
		const promise = PromisE.delay(10_000, 'done')
		expect(promise.pending).toBe(true)
		await vi.advanceTimersByTimeAsync(9_990)
		expect(promise.pending).toBe(true)
		await vi.advanceTimersByTimeAsync(10)
		expect(promise.pending).toBe(false)
		expect(promise.resolved).toBe(true)
		await expect(promise).resolves.toBe('done')
	})

	it('should resolve delayed promise with the duration provided', async () => {
		const promise = PromisE.delay(10_000, () => {})
		await vi.runAllTimersAsync()
		await expect(promise).resolves.toBe(10_000)
	})

	it('should execute a function after delay', async () => {
		const callback = vi.fn(() => 99)
		const promise = PromisE.delay(10_000, callback)
		await vi.runAllTimersAsync()
		await expect(promise).resolves.toBe(99)
		expect(callback).toHaveBeenCalledOnce()
	})

	it('should resolve delayed promise earlier than the duration provided', async () => {
		const promise = PromisE.delay(10_000, 'original value')
		await vi.advanceTimersByTimeAsync(5_000)
		expect(promise.pending).toBe(true)
		promise.resolve('changed value')
		expect(promise.pending).toBe(false)
		expect(promise.resolved).toBe(true)
		await expect(promise).resolves.toBe('changed value')
	})

	it('should reject delayed promise earlier than the duration provided', async () => {
		const promise = PromisE.delay(10_000, 'original value')
		await vi.advanceTimersByTimeAsync(5_000)
		expect(promise.pending).toBe(true)
		promise.reject('changed value')
		expect(promise.pending).toBe(false)
		expect(promise.rejected).toBe(true)
		await expect(promise).rejects.toBe('changed value')
	})

	it('should ignore .resolve() call if promise is already finalized', async () => {
		const promise = PromisE.delay(10_000, 'original value')
		// resolve the promise early
		promise.resolve('changed value')
		await vi.advanceTimersByTimeAsync(100)
		// attempt to resolve again
		promise.resolve('changed value again')
		await vi.advanceTimersByTimeAsync(10_000)
		await expect(promise).resolves.toBe('changed value')
	})
})
