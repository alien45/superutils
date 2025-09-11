import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import deferred from '../src/deferred'

describe('deferred', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('should call the callback after the specified delay', () => {
        const callback = vi.fn()
        const delayedFunc = deferred(callback, 100)

        delayedFunc()

        expect(callback).not.toHaveBeenCalled()

        vi.advanceTimersByTime(100)

        expect(callback).toHaveBeenCalled()
    })

    it('should call the callback with the correct arguments', () => {
        const callback = vi.fn()
        const delayedFunc = deferred(callback, 100)
        const args = [1, 'test', { a: 1 }]
        const args2 = [2, 'test', { a: 2 }]
        delayedFunc(...args)
        delayedFunc(...args2)

        expect(callback).not.toHaveBeenCalled()
        vi.advanceTimersByTime(100)

        expect(callback).toHaveBeenCalledWith(...args2)
    })
})