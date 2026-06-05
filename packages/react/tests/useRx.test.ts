/**
 * @vitest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Subject } from 'rxjs'
import useRx from '../src/rx/useRx'

describe('useRx', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.runOnlyPendingTimers()
		vi.useRealTimers()
	})

	it('should subscribe to an observable and update value on next emission', () => {
		const test$ = new Subject<string>()
		const { result, unmount } = renderHook(() => useRx(test$))

		// Initial state
		expect(result.current[0]).toBeUndefined()
		expect(result.current[1]).toBeInstanceOf(Function)
		expect(result.current[2]).toBeUndefined()
		expect(result.current[3]).toBe(test$)

		act(() => {
			test$.next('first value')
		})
		expect(result.current[0]).toBe('first value')

		act(() => {
			test$.next('second value')
		})
		expect(result.current[0]).toBe('second value')

		// Verify unsubscription on unmount
		const rootUnsubscribeSpy = vi.spyOn(test$, 'unsubscribe')
		const unsubscribeSpy = vi.spyOn(
			result.current[1].subscription!,
			'unsubscribe',
		)
		unmount()
		expect(rootUnsubscribeSpy).not.toHaveBeenCalled()
		rootUnsubscribeSpy.mockRestore()
		expect(unsubscribeSpy).toHaveBeenCalled()
		unsubscribeSpy.mockRestore()
	})
})
