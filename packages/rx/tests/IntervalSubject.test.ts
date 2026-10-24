import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { IntervalSubject } from '../src/IntervalSubject'

describe('IntervalSubject', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.restoreAllMocks()
		vi.useRealTimers()
	})

	it('should initialize with initialValue and start immediately if autoStart is true', () => {
		const initialValue = 10
		const subject = new IntervalSubject({
			autoStart: true,
			delay: 1000,
			initialValue,
			incrementBy: 1,
		})

		expect(subject.value).toBe(initialValue)
		expect(subject.running).toBe(true)

		vi.advanceTimersByTime(1000)
		expect(subject.value).toBe(11)
	})

	it('should not start if autoStart is false', () => {
		const subject = new IntervalSubject({
			autoStart: false,
			delay: 1000,
			initialValue: 0,
		})

		expect(subject.running).toBe(false)
		vi.advanceTimersByTime(2000)
		expect(subject.value).toBe(0)
	})

	it('should increment by the specified incrementBy value', () => {
		const subject = new IntervalSubject({
			autoStart: true,
			delay: 1000,
			incrementBy: 5,
			initialValue: 0,
		})

		vi.advanceTimersByTime(1000)
		expect(subject.value).toBe(5)

		vi.advanceTimersByTime(1000)
		expect(subject.value).toBe(10)
	})

	it('should correctly pause and resume execution', () => {
		const subject = new IntervalSubject({
			autoStart: true,
			delay: 1000,
			incrementBy: 1,
			initialValue: 0,
		})

		vi.advanceTimersByTime(1000)
		expect(subject.value).toBe(1)

		subject.pause()
		expect(subject.running).toBe(false)

		vi.advanceTimersByTime(2000)
		expect(subject.value).toBe(1) // Should not have changed

		subject.resume()
		expect(subject.running).toBe(true)

		vi.advanceTimersByTime(1000)
		expect(subject.value).toBe(2)
	})

	it('should stop and reset value to 0', () => {
		const subject = new IntervalSubject({
			autoStart: true,
			delay: 1000,
			incrementBy: 1,
			initialValue: 50,
		})

		vi.advanceTimersByTime(1000)
		expect(subject.value).toBe(51)

		subject.stop()
		expect(subject.running).toBe(false)
		expect(subject.value).toBe(50)
	})

	it('should ignore delay duration changes until next start/resume', () => {
		const subject = new IntervalSubject({
			autoStart: true,
			delay: 1000,
			initialValue: 0,
		})

		// Attempting to change delay while running
		subject.delay = 500
		expect(subject.delay).toBe(1000)

		subject.pause()
		subject.delay = 500
		expect(subject.delay).toBe(500)

		subject.start()
		vi.advanceTimersByTime(500)
		expect(subject.value).toBe(1)
	})

	it('should prevent multiple interval assignments on redundant start calls', () => {
		const setIntervalSpy = vi.spyOn(global, 'setInterval')
		const subject = new IntervalSubject({ autoStart: false, delay: 1000 })

		subject.start()
		subject.start()
		subject.start()

		expect(setIntervalSpy).toHaveBeenCalledTimes(1)

		subject.stop()
		expect(subject.running).toBe(false)
	})

	it('should conditionally pause using "pauseIf()"', () => {
		const subject = new IntervalSubject(true)
		const stopAfter = 2
		subject.pauseIf = value => value === stopAfter

		vi.advanceTimersByTime(stopAfter * 1000)
		expect(subject.running).toBe(true)
		expect(subject.value).toBe(stopAfter)

		vi.advanceTimersByTime(1000)
		expect(subject.running).toBe(false)
		expect(subject.value).toBe(2)

		vi.advanceTimersByTime(1000)
		expect(subject.running).toBe(false)
		expect(subject.value).toBe(2)
	})

	it('should conditionally stop using "stopIf()"', () => {
		const subject = new IntervalSubject(true)
		const stopAfter = 2
		subject.stopIf = value => value === stopAfter

		vi.advanceTimersByTime(stopAfter * 1000)
		expect(subject.running).toBe(true)
		expect(subject.value).toBe(stopAfter)

		vi.advanceTimersByTime(1000)
		expect(subject.running).toBe(false)
		expect(subject.value).toBe(0)

		vi.advanceTimersByTime(1000)
		expect(subject.running).toBe(false)
		expect(subject.value).toBe(0)
	})
})
