import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PromisE, { PromisEBase, TIMEOUT_MAX, TimeoutPromise } from '../src'

describe('PromisE.timeout', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('general', () => {
		it('should set default value and keep timeout.defaults in sync with TimeoutPromise.defaults', () => {
			expect(PromisE.timeout.defaults).toEqual(TimeoutPromise.defaults)
			PromisE.timeout.defaults = {
				...TimeoutPromise.defaults,
				timeout: 9999,
			}
			expect(PromisE.timeout.defaults).toEqual(TimeoutPromise.defaults)
			expect(TimeoutPromise.defaults.timeout).toEqual(9999)
			TimeoutPromise.defaults.timeout = TIMEOUT_MAX
		})
		it('should use default timeout duration when invalid value provided', async () => {
			const p = PromisE.timeout(
				{ timeout: 'not a valid number' as any },
				999,
			)
			const p2 = PromisE.timeout('not a valid number' as any, 999)
			await vi.runAllTimersAsync()
			expect(p).instanceOf(PromisEBase)
			await expect(p).resolves.toBe(999)
			await expect(p2).resolves.toBe(999)
			expect(p.data).instanceOf(PromisEBase)
			expect(p.timeout).instanceOf(PromisEBase)
		})

		it('should use default batch promise func even when wrong value is provided', async () => {
			const p = PromisE.timeout(
				{ batchFunc: 'Invalid PromisEBase method' as any },
				999,
				99,
			)
			await vi.runAllTimersAsync()
			await expect(p).resolves.toEqual([999, 99])
		})

		it('should create a promise that resolves after the specified timeout', async () => {
			const p = PromisE.timeout(500, PromisE.delay(300, 'value'))
			await vi.advanceTimersByTimeAsync(300)
			await expect(p).resolves.toBe('value')
			await vi.runAllTimersAsync()
		})

		it('should create a promise that rejects after the specified timeout', async () => {
			const p = PromisE.timeout(3000, PromisE.delay(5000))
			const start = new Date()
			p.catch(() => {
				const diff = new Date().getTime() - start.getTime()
				expect(diff).toBeGreaterThanOrEqual(3000)
			})
			await vi.advanceTimersByTimeAsync(3000)
			await vi.runAllTimersAsync()
			await expect(p).rejects.toEqual(expect.any(Error))
			expect(p.timedout).toBe(true)
		})

		it('should use specified batchFunc (all, race...)', async () => {
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
			for (const [batchFunc, expected] of funcRes) {
				const promises = [
					PromisE.delay(3000, values[0]),
					PromisE.delay(1000, values[1]),
					PromisE.delay(4000, values[2]),
				] as const
				const result = PromisE.timeout({ batchFunc }, ...promises)
				await vi.runAllTimersAsync()
				await expect(result).resolves.toEqual(expected)
			}
		})

		it('should abort on early finalize', async () => {
			const abortCtrl = new AbortController()
			const p = PromisE.timeout(
				{ abortCtrl, timeout: 5000 },
				PromisE.delay(1),
			)
			// resolve the promise externally (early finalize)
			p.resolve(0)

			await vi.runAllTimersAsync()

			await expect(p).resolves.toBe(0)
			expect(abortCtrl.signal.aborted).toBe(true)
			expect(p.aborted).toBe(false) // only true when promsie was rejected because of abort
			expect(p.timedout).toBe(false)
		})
	})

	describe('funtions', () => {
		it('should accepts & invoke funtions with PromisE.try', async () => {
			const values = new Array(10).fill(0).map((_, i) => i)
			const p = PromisE.timeout(
				{ batchFunc: 'all' },
				...values.map(i => () => i),
			)
			await vi.runAllTimersAsync()
			await expect(p).resolves.toEqual(values)
		})

		it('should should accept & invoke functions and throw error', async () => {
			const handleErr = vi.fn()
			const arrFunc = new Array(10).fill(0).map((_, i) => async () => {
				if (i !== 5) return i

				throw new Error('five')
			})
			const p = PromisE.timeout({ batchFunc: 'all' }, ...arrFunc)
			p.catch(() => {})
			await vi.runAllTimersAsync()
			await p.catch(handleErr)

			expect(handleErr).toHaveBeenCalledExactlyOnceWith(new Error('five'))
		})
	})

	describe('AbortSignal', () => {
		it('should externally abort using AbortController', async () => {
			// vi.useRealTimers()
			const abortCtrl = new AbortController()
			const p = PromisE.timeout({ abortCtrl, timeout: 1000 }, async () =>
				PromisE.delay(3000),
			)
			p.catch(() => {}) // avoid unhandled rejection
			abortCtrl.abort()
			await vi.advanceTimersByTimeAsync(500)
			await expect(p).rejects.toEqual(expect.any(Error))
			expect(p.aborted).toBe(true)
			expect(p.timedout).toBe(false)
		})

		it('should externally abort using AbortSignal', async () => {
			const abortCtrl = new AbortController()
			const p = PromisE.timeout(
				{
					signal: abortCtrl.signal,
					timeout: 5000,
				},
				PromisE.delay(30000),
			)
			abortCtrl.abort()
			p.catch(() => {}) // avoid unhandled rejection
			await vi.advanceTimersByTimeAsync(1)
			await expect(p).rejects.toEqual(expect.any(Error))
			expect(p.aborted).toBe(true)
			expect(p.timedout).toBe(false)
		})

		it('should externally abort using AbortSignal and abort provided secondary AbortController', async () => {
			const abortCtrlExt = new AbortController()
			const abortCtrl = new AbortController()
			const p = PromisE.timeout(
				{ abortCtrl, signal: abortCtrlExt.signal, timeout: 5000 },
				PromisE.delay(1000),
			)
			abortCtrlExt.abort()
			p.catch(() => {}) // avoid unhandled rejection
			await vi.advanceTimersByTimeAsync(1)
			await expect(p).rejects.toEqual(expect.any(Error))
			// when one controller is aborted, the other should be too
			expect(abortCtrl.signal.aborted).toBe(true)
			expect(p.aborted).toBe(true)
			expect(p.timedout).toBe(false)
		})

		it('should should progagate abort signal when promise times out', async () => {
			const abortCtrl = new AbortController()
			const p = PromisE.timeout(
				{ abortCtrl, timeout: 5000 },
				PromisE.delay(30000),
			)
			p.catch(() => {}) // avoid unhandled rejection
			await vi.runAllTimersAsync()
			await expect(p).rejects.toEqual(expect.any(Error))
			expect(p.abortCtrl?.signal.aborted).toBe(true)
			expect(p.aborted).toBe(false)
			expect(p.timedout).toBe(true)
		})
	})
})
