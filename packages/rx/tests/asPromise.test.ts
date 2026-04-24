import { noop } from '@superutils/core'
import { BehaviorSubject, interval, Subject } from 'rxjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { asPromise } from '../src'

describe('subjectAsPromise', () => {
	afterEach(() => {
		vi.useRealTimers()
	})
	beforeEach(() => {
		vi.useFakeTimers()
	})

	it('should throw error if subject is not an observable or subject', async () => {
		vi.useRealTimers()
		await expect(asPromise(null as any)).rejects.toThrow()
		await expect(asPromise(undefined as any)).rejects.toThrow()
		await expect(asPromise({} as any)).rejects.toThrow()
		await expect(asPromise(interval(1))).resolves.toBe(0)
	})

	it('should resolve when the subject emits predefined expected value', async () => {
		const subject = new Subject<number>()
		const promise = asPromise(subject, 3)

		subject.next(1)
		await vi.advanceTimersByTimeAsync(100)
		expect(promise.resolved).toBe(false)

		subject.next(2)
		await vi.advanceTimersByTimeAsync(100)
		expect(promise.resolved).toBe(false)

		subject.next(3)
		await vi.advanceTimersByTimeAsync(100)
		expect(promise.resolved).toBe(true)
		await expect(promise).resolves.toBe(3)
	})

	it('should resolve based on dynamic expected value', async () => {
		const subject = new Subject<number>()
		const promise = asPromise(subject, value => value >= 2)

		subject.next(1)
		await vi.advanceTimersByTimeAsync(100)
		expect(promise.resolved).toBe(false)

		subject.next(2)
		await vi.advanceTimersByTimeAsync(100)
		expect(promise.resolved).toBe(true)
		await expect(promise).resolves.toBe(2)

		subject.next(3)
		await vi.advanceTimersByTimeAsync(100)
		await expect(promise).resolves.toBe(2) // promise was already resolved
	})

	it('should resolve with the first value received using BehaviorSubject', async () => {
		const subject = new BehaviorSubject<number | undefined>(undefined)
		const promise = asPromise(subject)
		await vi.advanceTimersByTimeAsync(1)
		expect(promise.resolved).toBe(true)
		await expect(promise).resolves.toBe(undefined)
	})

	it('should resolve with the next value received using Subject', async () => {
		const subject = new Subject<number>()

		// value will not be considered because subject is not yet subscribed
		subject.next(0)

		const promise = asPromise(subject)
		await vi.advanceTimersByTimeAsync(100)
		expect(promise.resolved).toBe(false)

		subject.next(1)
		await vi.advanceTimersByTimeAsync(100)
		subject.next(1)
	})

	it('should reject after timeout', async () => {
		const subject = new Subject<number>()
		const timeoutMsg = new Error('timed out')
		const promise = asPromise(subject, 1, {
			timeout: 100,
			timeoutMsg,
		})
		promise.catch(noop)
		const promise2 = asPromise(subject, 1, {
			timeout: 100,
		})
		promise2.catch(noop)
		await vi.advanceTimersByTimeAsync(100)
		await expect(promise).rejects.toThrow(expect.any(Error))
		await expect(promise2).rejects.toThrow(expect.any(Error))
	})

	it('should reject using abort controller', async () => {
		const subject = new Subject<number>()
		const promise = asPromise(subject, 1, {
			abortCtrl: new AbortController(),
		})
		promise.catch(noop)

		// abort after 100ms
		setTimeout(() => promise.abortCtrl?.abort(), 100)

		await vi.advanceTimersByTimeAsync(99)
		expect(promise.resolved).toBe(false)
		expect(promise.aborted).toBe(false)

		await vi.advanceTimersByTimeAsync(1)
		expect(promise.rejected).toBe(true)
		expect(promise.aborted).toBe(true)
		await expect(promise).rejects.toThrow(expect.any(Error))
	})
})
