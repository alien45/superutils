import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PromisE from '../src'

describe('PromisE.timeout', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should create a promise that resolves after the specified timeout', async () => {
		const p = PromisE.timeout(5000)
		let resolved = false
		p.then(() => {
			resolved = true
		})
		expect(resolved).toBe(false)
		await vi.runAllTimersAsync()
		expect(resolved).toBe(true)
	})

	it('should create a promise that rejects after the specified timeout', async () => {
		const p = PromisE.timeout(3000, PromisE.delay(5000))
		let rejected = false
		p.catch(err => {
			rejected = true
			expect(err).toBeInstanceOf(Error)
			expect(err.message).toBe('Timed out after 3000ms')
		})
		expect(rejected).toBe(false)
		await vi.runAllTimersAsync()
		expect(rejected).toBe(true)
		expect(p.timedout).toBe(true)
	})
})
