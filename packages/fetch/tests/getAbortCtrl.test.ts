import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getAbortCtrl } from '../src'

describe('getAbortCtrl', () => {
	afterEach(() => {
		vi.useRealTimers()
	})

	beforeEach(() => {
		vi.useFakeTimers()
	})

	it('should return a new AbortController instance when no/empty options are provided', () => {
		const abortCtrl = getAbortCtrl(undefined as any)
		expect(abortCtrl).toBeInstanceOf(AbortController)
	})

	it('should return a new AbortController instance when no/empty options are provided', () => {
		const abortCtrlExt = new AbortController()
		const options = {
			signal: abortCtrlExt.signal,
		}
		const abortCtrl = getAbortCtrl(options)
		expect(abortCtrl).toBeInstanceOf(AbortController)
		expect(abortCtrl).not.toBe(abortCtrlExt)

		// abort external signal should abort internal abort controller
		abortCtrlExt.abort()
		vi.advanceTimersByTime(10)
		expect(abortCtrl.signal.aborted).toBe(true)
	})
})
