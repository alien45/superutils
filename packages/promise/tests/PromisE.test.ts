import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PromisE, { ResolveIgnored } from '../src'

describe('PromisE', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should create a pending PromisE instance', async () => {
		const p = new PromisE<number>(resolve => {
			setTimeout(() => resolve(42), 100)
		})
		expect(p).toBeInstanceOf(PromisE)
		expect(p.pending).toBe(true)
		expect(p.resolved).toBe(false)
		expect(p.rejected).toBe(false)
		await vi.runAllTimersAsync()
		expect(p.pending).toBe(false)
		expect(p.resolved).toBe(true)
		expect(p.rejected).toBe(false)
		const result = await p
		expect(result).toBe(42)
	})

	it('should create a promises that is resolved externally', async () => {
		const onFinalize = vi.fn()
		const p1 = new PromisE<number>()
		expect(p1.pending).toBe(true)
		p1.onEarlyFinalize.push(onFinalize)
		setTimeout(() => p1.resolve(100), 5000)
		expect(p1.pending).toBe(true)
		await vi.runAllTimersAsync()
		expect(p1.pending).toBe(false)
		expect(p1.resolved).toBe(true)
		expect(p1.rejected).toBe(false)
		const result = await p1
		expect(result).toBe(100)
		expect(onFinalize).toHaveBeenCalledOnce()
	})

	it('should create a promise that is rejected externally', async () => {
		const onFinalize = vi.fn()
		const p1 = new PromisE<number>()
		expect(p1.pending).toBe(true)
		p1.onEarlyFinalize.push(onFinalize)
		setTimeout(() => p1.reject('error'), 3000)
		expect(p1.pending).toBe(true)
		vi.runAllTimersAsync()
		await p1.catch(() => {})
		expect(p1.pending).toBe(false)
		expect(p1.resolved).toBe(false)
		expect(p1.rejected).toBe(true)
		await expect(p1).rejects.toThrow('error')
		expect(onFinalize).toHaveBeenCalledOnce()
	})

	it('should mimic Promise.try behavior', async () => {
		const successFn = vi.fn((x: number) => x + 1)
		const failFn = vi.fn(() => {
			throw new Error('fail')
		})

		const result1 = await PromisE.try(successFn, 1)
		expect(result1).toBe(2)
		expect(successFn).toHaveBeenCalledOnce()

		await expect(PromisE.try(failFn)).rejects.toThrow('fail')
		expect(failFn).toHaveBeenCalledOnce()
	})

	it('should mimic all Promise static methods', async () => {
		await expect(PromisE.resolve(1)).resolves.toBe(1)

		await PromisE.reject(new Error('error')).catch((err: Error) =>
			expect(err).toBeInstanceOf(Error),
		)
		await expect(
			PromisE.all([Promise.resolve(3), Promise.resolve(4)]),
		).resolves.toEqual([3, 4])

		await expect(
			PromisE.allSettled([
				Promise.resolve(5),
				Promise.reject(new Error('err')),
			]),
		).resolves.toEqual([
			{ status: 'fulfilled', value: 5 },
			{ status: 'rejected', reason: new Error('err') },
		])
		await expect(
			PromisE.any([Promise.resolve(6), Promise.reject(new Error('err'))]),
		).resolves.toBe(6)
		await expect(
			PromisE.race([
				Promise.resolve(7),
				Promise.reject(new Error('err')),
			]),
		).resolves.toBe(7)
		const pwr = PromisE.withResolvers<number>()
		pwr.resolve(8)
		await expect(pwr.promise).resolves.toBe(8)
	})
})
