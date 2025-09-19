import {
    afterEach,
    beforeEach,
    describe,
    it,
    expect,
    vi
} from 'vitest'
import PromisE, { IPromisE, ResolveError, ResolveIgnored } from '../src/'

describe('PromisE.deferred', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should accept promises, async funcions and regular functions that returns a promise', async () => {
        const onResult = vi.fn()
        const deferredFn = PromisE.deferred({ delayMs: 0, onResult })

        deferredFn(() => PromisE.delay(50, 1))
        deferredFn(PromisE.delay(150, 2))
        const last = deferredFn(async () => 3)
        vi.runAllTimersAsync()
        await last
        expect(onResult).toHaveBeenCalledTimes(3)
        expect(onResult).toHaveBeenCalledWith(1)
        expect(onResult).toHaveBeenCalledWith(2)
        expect(onResult).toHaveBeenCalledWith(3)
    })

    it('should allow sequential execution without debounce or throttle', async () => {
        const deferredFn = PromisE.deferred({ delayMs: 0 })
        const executionOrder: (number | undefined)[] = []
        const addToArr = (res?: number) => {
            executionOrder.push(res)
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
        const deferredFn = PromisE.deferred({
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
        const deferredFn = PromisE.deferred({
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
        const deferredFn = PromisE.deferred({
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

    it('should handle failed promises: 1. resolve with `undefined` 2. resolve with `reason` and 3. never resolve', async () => {
        const none = Symbol('none')
        const simlateScenario = async (
            resolveError: ResolveError,
            expectLast: any | typeof none,
            expectError: any | typeof none,
        ) => {

            const onError = vi.fn()
            const conf = {
                delayMs: 100,
                onError,
                resolveError,
            }
            const deferredFn = PromisE.deferred(conf)
            const last = deferredFn(() => PromisE.delayReject(500, 3)) // no .catch() needed bacause of `resolveError` flag
            vi.runAllTimersAsync()
            expectLast !== none && expect(await last).toBe(expectLast)
            expectError !== none && expect(onError).toHaveBeenCalledExactlyOnceWith(expectError)
        }

        // force failed promises to be resolved with `reason` (error)
        simlateScenario(
            ResolveError.WITH_ERROR,
            3,
            none,
        )
        // force failed promises to be resolved with `undefined`
        simlateScenario(
            ResolveError.WITH_UNDEFINED,
            undefined,
            3,
        )
        // force failed promises to be never be resolved or rejected
        simlateScenario(
            ResolveError.NEVER,
            none,
            none,
        )

    })

    it('should throttle calls, sequentially executing the first and last', async () => {
        const deferredFn = PromisE.deferred({
            delayMs: 100,
            resolveIgnored: ResolveIgnored.WITH_LAST,
            throttle: true,
        })
        const results: (number | undefined)[] = []
        const executionOrder: number[] = []
        const all = Promise.all(
            new Array(3).fill(0).map((_, i) => 
                deferredFn(() => {
                    executionOrder.push(i + 1)
                    return PromisE.delay(50, i + 1)
                }).then(res => results.push(res))
            )
        )
        vi.runAllTimersAsync()
        await all

        expect(executionOrder).toEqual([1, 3])
        expect(results).toContain(1)
        expect(results).toContain(3)
    })

    it('should resolve ignored promises with undefined', async () => {
        const deferredFn = PromisE.deferred({
            delayMs: 100,
            resolveIgnored: ResolveIgnored.WITH_UNDEFINED,
        })
        const all = Promise.all([
            deferredFn(() => PromisE.delay(50, 1)),
            deferredFn(() => PromisE.delay(50, 2)),
            deferredFn(() => PromisE.delay(50, 3)),
        ])
        vi.runAllTimersAsync()
        const results = await all

        expect(results).toContain(3)
        const numIgnored = results
            .filter(x => x === undefined)
            .length
        expect(numIgnored).toBe(2)
    })

    it('should bind callbacks to thisArg and invoke callbacks: onResult, onError & onIgnore callbacks', async () => {
        const context: Parameters<typeof PromisE.deferred>[0] & Record<string, any> = {
            delayMs: 100,
            error: null,
            ignored: false,
            result: null,
            onError(err) { this.error = err },
            onIgnore() { this.ignored = true },
            onResult(res) { this.result = res },
            get thisArg() { return this }
        }

        const deferredFn = PromisE.deferred(context)
        deferredFn(() => PromisE.delay(50, 1))
        deferredFn(() => PromisE.delay(50, 2))
        vi.runAllTimersAsync()
        deferredFn(() => PromisE.delayReject(50,'error'))
        const delay = PromisE.delay(1051)
        vi.runAllTimersAsync()
        await delay

        expect(context.result).toBe(null) // because the last one rejects
        expect(context.error).toBe('error')
        expect(context.ignored).toBe(true)
    })
})
