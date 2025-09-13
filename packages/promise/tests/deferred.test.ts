import {
    afterEach,
    beforeEach,
    describe,
    it,
    expect,
    vi
} from 'vitest'
import { PromisE_deferred } from '../src/deferred'
import { PromisE } from '../src/PromisE'
import { ResolveError, ResolveIgnored } from '../src/types'

describe('PromisE_deferred', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })


    it('should allow sequential execution without debounce or throttle', async () => {
        const deferredFn = PromisE_deferred({ delayMs: 0 })
        const executionOrder: (number | undefined)[] = []
        const addToArr = (res?: number) => {
            executionOrder.push(res)
            // console.log('addToArr', res, promises.map((p, i) => ({ [i + 1]: p.resolved})))
        }
        const promises = [
            deferredFn(() => PromisE.delay(1000, 1)),
            deferredFn(() => PromisE.delay(150, 2)),
            deferredFn(() => PromisE.delay(550, 3)),
            deferredFn(() => PromisE.delay(2000, 4)),
            deferredFn(() => PromisE.delay(0, 5)),
        ]
        promises.forEach(p => p.then(addToArr))
        await vi.runAllTimersAsync()
        expect(executionOrder).toEqual([1, 2, 3, 4, 5])
    })

    it('should debounce calls and only execute last one but all resolve with the last value', async () => {
        const onIgnore = vi.fn()
        const onResult = vi.fn()
        const onError = vi.fn()
        const deferredFn = PromisE_deferred({
            delayMs: 100,
            onError,
            onIgnore,
            onResult,
            resolveIgnored: ResolveIgnored.WITH_LAST,
        })
        const results = Promise.all([
            deferredFn(() => PromisE.delay(50, 1)),
            deferredFn(() => PromisE.delay(50, 2)),
            deferredFn(() => PromisE.delay(50, 3)),    
        ])
        vi.runAllTimersAsync()
        expect(await results).toEqual([3, 3, 3])
        vi.runAllTimersAsync()
        expect(onError).not.toHaveBeenCalled()
        expect(onResult).toHaveBeenCalledTimes(1)
        expect(onIgnore).toHaveBeenCalledTimes(2)
    })

    it('should throttle calls, only execute first & last and all ignored will resolve with `undefined`', async () => {
        const deferredFn = PromisE_deferred({
            delayMs: 100,
            resolveIgnored: ResolveIgnored.WITH_UNDEFINED,
            throttle: true,
            trailing: true,
        })

        const all = Promise.all([
            deferredFn(() => PromisE.delay(50, 1)),
            deferredFn(() => PromisE.delay(150, 2)),
            deferredFn(() => PromisE.delay(250, 3)),    
        ])
        vi.runAllTimersAsync()
        const results = await all
        expect(results).toEqual([1, undefined, 3])
    })

    it('should leading-edge debounce calls and only execute first & last and ignored will never resolve', async () => {
        const onResult = vi.fn()
        const onIgnore = vi.fn()
        const deferredFn = PromisE_deferred({
            delayMs: 100,
            onIgnore,
            onResult,
            resolveIgnored: ResolveIgnored.NEVER,
            leading: true,
        })
        
        deferredFn(() => PromisE.delay(50, 1))
        deferredFn(() => PromisE.delay(50, 2))
        deferredFn(() => PromisE.delay(50, 3))
        deferredFn(() => PromisE.delay(50, 4))
        deferredFn(() => PromisE.delay(50, 5))
        const last = deferredFn(() => PromisE.delay(5000, 6))
        vi.runAllTimersAsync()
        expect(await last).toBe(6)
        // check last promise
        expect(onResult).toHaveBeenCalledWith(1)
        expect(onResult).toHaveBeenLastCalledWith(6)
        expect(onResult).toHaveBeenCalledTimes(2)
        // onIgnore called twice for 2 first that were ignored
        expect(onIgnore).toHaveBeenCalledTimes(4)
    })

    it('should debounce calls and gracefully handle error', async () => {
        const onError = vi.fn()
        const onIgnore = vi.fn()
        const deferredFn = PromisE_deferred({
            delayMs: 100,
            onError,
            onIgnore,
            resolveError: ResolveError.WITH_UNDEFINED,
            resolveIgnored: ResolveIgnored.WITH_LAST,
        })

        
        deferredFn(() => PromisE.delay(50, 1))
        deferredFn(() => PromisE.delay(50, 2))
        deferredFn(() => PromisE.delay(1000, 2.5))
        const last = deferredFn(() => PromisE.delayReject(500, 3)) // no .catch() needed bacause of `resolveError` flag
        vi.runAllTimersAsync()
        expect(await last).toBe(undefined)
        expect(onError).toHaveBeenCalledExactlyOnceWith(3)
        expect(onIgnore).toHaveBeenCalledTimes(3)
    })

    it('should throttle calls, sequentailly executing the first and last', async () => {
        const deferredFn = PromisE_deferred({
            delayMs: 100,
            resolveIgnored: ResolveIgnored.WITH_LAST,
            throttle: true,
        })
        const results: (number | undefined)[] = []
        const executionOrder: number[] = []

        const p1 = deferredFn(() => {
            executionOrder.push(1)
            return PromisE.delay(50, 1)
        }).then(res => results.push(res))

        const p2 = deferredFn(() => {
            executionOrder.push(2)
            return PromisE.delay(50, 2)
        }).then(res => results.push(res))

        const p3 = deferredFn(() => {
            executionOrder.push(3)
            return PromisE.delay(50, 3)
        }).then(res => results.push(res))

        const all = Promise.all([p1, p2, p3, PromisE.delay(200)])
        vi.runAllTimersAsync()
        await all

        expect(executionOrder).toEqual([1, 3])
        expect(results).toContain(1)
        expect(results).toContain(3)
    })

    it('should resolve ignored promises with undefined', async () => {
        const deferredFn = PromisE_deferred({
            delayMs: 100,
            resolveIgnored: ResolveIgnored.WITH_UNDEFINED,
        })

        const p1 = deferredFn(() => PromisE.delay(50, 1))
        const p2 = deferredFn(() => PromisE.delay(50, 2))
        const p3 = deferredFn(() => PromisE.delay(50, 3))

        const all = Promise.all([p1, p2, p3])
        vi.runAllTimersAsync()
        const results = await all

        expect(results).toContain(undefined)
        expect(results).toContain(3)
    })

    it('should handle rejections and call onError', async () => {
        const onError = vi.fn()
        const deferredFn = PromisE_deferred({
            delayMs: 100,
            onError
        })
        

        const p = deferredFn(() => PromisE.delayReject(1000, 'error'))
        vi.runAllTimersAsync()
        await expect(async () => await p).rejects.toThrowError('error')
        expect(onError).toHaveBeenCalledWith('error')
    })

    it('should call onResult and onIgnore callbacks', async () => {
        const onResult = vi.fn()
        const onIgnore = vi.fn()
        const deferredFn = PromisE_deferred({ delayMs: 100, onResult, onIgnore })

        deferredFn(() => PromisE.delay(50, 1))
        deferredFn(() => PromisE.delay(50, 2))
        deferredFn(() => PromisE.delay(50, 3))
        deferredFn(() => PromisE.delay(50, 4))
        deferredFn(() => PromisE.delay(50, 5))
        const last = deferredFn(() => PromisE.delay(50, 6))
        vi.runAllTimersAsync()
        await last

        expect(onResult).toHaveBeenCalledWith(6)
        expect(onIgnore).toHaveBeenCalledTimes(5)
    })

    it('should bind callbacks to thisArg', async () => {
        const context: Parameters<typeof PromisE_deferred>[0] & Record<string, any> = {
            delayMs: 100,
            error: null,
            ignored: false,
            resolveError: ResolveError.NEVER,
            result: null,
            onError(err) { this.error = err },
            onIgnore() { this.ignored = true },
            onResult(res) { this.result = res },
            get thisArg() { return this }
        }

        const deferredFn = PromisE_deferred(context)
        deferredFn(() => PromisE.delay(50, 1))
        deferredFn(() => PromisE.delay(50, 2))
        deferredFn(() => PromisE.delayReject(50,'error'))
        const delay = PromisE.delay(151)
        vi.runAllTimersAsync()
        await delay

        expect(context.result).toBe(null) // because the last one rejects
        expect(context.error).toBe('error')
        expect(context.ignored).toBe(true)
    })
})
