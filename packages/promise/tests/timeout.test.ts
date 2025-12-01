import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PromisE from '../src'

describe('PromisE.timeout', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should use default timeout duration', async () => {
		const p = PromisE.timeout(null as any, 999)
		await vi.runAllTimersAsync()
		await expect(p).resolves.toBe(999)
	})

	it('should use default batch promise func even when wrong value is provided', async () => {
		const p = PromisE.timeout(
			{ func: 'Invalid PromisEBase method' as any },
			999,
		)
		await vi.runAllTimersAsync()
		await expect(p).resolves.toBe(999)
	})

	it('should create a promise that resolves after the specified timeout', async () => {
		const p = PromisE.timeout(500, PromisE.delay(300, 'value'))
		await vi.runAllTimersAsync()
		await expect(p).resolves.toBe('value')
	})

	it('should create a promise that rejects after the specified timeout', async () => {
		const p = PromisE.timeout(3000, PromisE.delay(5000))
		const start = new Date()
		p.catch(() => {
			const diff = new Date().getTime() - start.getTime()
			expect(diff).toBeGreaterThanOrEqual(3000)
		})
		await vi.runAllTimersAsync()
		await expect(p).rejects.toEqual(new Error('Timed out after 3000ms'))
		expect(p.timedout).toBe(true)
	})

	it('should use specified batch promise func (all, race...)', async () => {
		const values = [999, 9999, '99999']
		const funcRes = [
			['all', values],
			[
				'allSettled',
				values.map(value => ({
					status: 'fulfilled',
					value,
				})),
			],
			['any', values[1]],
			['race', values[1]],
		] as const
		for (const [func, expected] of funcRes) {
			const promises = [
				PromisE.delay(3000, values[0]),
				PromisE.delay(1000, values[1]),
				PromisE.delay(4000, values[2]),
			] as const
			const result = PromisE.timeout({ func }, ...promises)
			await vi.runAllTimersAsync()
			await expect(result).resolves.toEqual(expected)
		}
	})
})
