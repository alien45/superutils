import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi
} from 'vitest'
import PromisE from '../src'

describe('PromisE.deferredCallback', () => {
    let context: Parameters<typeof PromisE.deferredCallback>[1] & Record<string, any>
    beforeEach(() => {
        vi.useFakeTimers()
        context = {
            callCount: 0,
            delayMs: 100,
            error: null,
            ignored: false,
            lastResult: null,
            results: [] as number[],
            onError(err) {
                this.callCount++
                this.error = err
            },
            onIgnore() { this.ignored = true },
            onResult(res) {
                this.callCount++
                this.lastResult = res
                this.results.push(res)
            },
            get thisArg() { return this }
        }
    })

    afterEach(() => {
        vi.useRealTimers()
        context = {}
    })

    it('should bind callbacks to thisArg and invoke callbacks: onResult, onError & onIgnore callbacks ', async () => {
        const callback = (value: number) => {
            if (value === 3) return PromisE.delayReject(50, 'error')
            return PromisE.delay(50, `${value}`)
        }

        const deferredCb = PromisE.deferredCallback(callback, context)
        deferredCb(1)
        deferredCb(2)
        vi.runAllTimersAsync()
        const last = deferredCb(3)
        vi.runAllTimersAsync()

        await expect(last).rejects.toThrow('error')
        expect(context.error).toBe('error')
        expect(context.ignored).toBe(true)
        expect(context.lastResult).toBe(null)// because the last/only executed callback rejected
        expect(context.results).toEqual([])
    })

    it('should debounce/defer calls, sequentially executing the last of every series', async () => {
        const values: number[] = []
        type FakeEvent = { target: { value: number } }
        const handleChange = vi.fn((e: FakeEvent) =>
            values.push(e.target.value)
        )
        const handleChangeDeferred = PromisE.deferredCallback(handleChange, {
            delayMs: 300,
            throttle: false, // throttle with delay duration set in `defer`
        })
        // simulate click events by setting up triggers with specific delays
        const delays = [
            // series 1
            100,
            150,
            200,
            // series 2
            550,
            580,
            600,
            // series 3
            1000,
            1100,
        ]
        delays.forEach(value =>
            setTimeout(() => handleChangeDeferred({
                target: { value }
            }), value)
        )
        await vi.runAllTimersAsync()
        expect(values).toEqual([200, 600, 1100])
    })
})