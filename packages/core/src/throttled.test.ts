import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import throttled from './throttled'

describe('throttled', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('should call the callback with the correct arguments', () => {
        const callback = vi.fn((n: number) => n)
        const throttledFunc = throttled(callback, 100)

        // series 1
        throttledFunc(1) // first in serries gets executed
        throttledFunc(2)
        vi.advanceTimersByTime(110)
        expect(callback).toHaveBeenLastCalledWith(1)
        expect(callback).not.toHaveBeenLastCalledWith(2)

        // series 2
        throttledFunc(3)
        vi.advanceTimersByTime(10)
        throttledFunc(4)
        throttledFunc(5)
        vi.advanceTimersByTime(110)
        expect(callback).toHaveBeenLastCalledWith(3)
        expect(callback).not.toHaveBeenLastCalledWith(4)
        expect(callback).not.toHaveBeenLastCalledWith(5)
    })

    it('should call the callback after the specified delay', () => {
        const callback = vi.fn()
        const delayedFunc = throttled(callback, 100)
        delayedFunc()
        delayedFunc()
        vi.advanceTimersByTime(100)
        expect(callback).toHaveBeenCalledOnce()
    })
})