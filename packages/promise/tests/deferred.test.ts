import {
    afterEach,
    beforeEach,
    describe,
    it,
    expect,
    vi
} from 'vitest'
import PromisE, {
    PromisE_Deferred_Options,
    ResolveError,
    ResolveIgnored,
} from '../src/'

export const getDeferredContext = () => ({
    data: {
        errors: [] as unknown[],
        ignored: [] as unknown[],
        results: [] as unknown[],
    },
    delayMs: 100,
    onError(err) { this.data.errors.push(err) },
    onIgnore(ignored) { this.data.ignored.push(ignored) },
    onResult(result) { this.data.results.push(result) },
    resolveIgnored: ResolveIgnored.WITH_LAST,
    resolveError: ResolveError.REJECT,
    throttle: false,
    get thisArg() { return this }
}) as PromisE_Deferred_Options & Record<string, any>

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
        await vi.runAllTimersAsync()
        await last
        expect(onResult).toHaveBeenCalledTimes(3)
        expect(onResult).toHaveBeenCalledWith(1)
        expect(onResult).toHaveBeenCalledWith(2)
        expect(onResult).toHaveBeenCalledWith(3)
    })

    it('should allow sequential execution without debounce or throttle', async () => {
        const context = getDeferredContext()
        context.delayMs = 0 // disable debounce/throttle for sequential execution
        const deferredFn = PromisE.deferred(context)
        const delays = [
            1000,
            150,
            550,
            2000,
            0,
        ]
        delays.forEach((delay, i) =>
            deferredFn(() => PromisE.delay(delay, i + 1))
        )

        await vi.runAllTimersAsync()
        expect(context.data.results).toEqual(delays.map((_, i) => i + 1))
    })

    it('should debounce calls and only execute last one but all resolve with the last value', async () => {
        const context = getDeferredContext()
        context.resolveIgnored = ResolveIgnored.WITH_LAST
        const deferredFn = PromisE.deferred(context)
        const all = Promise.all([
            deferredFn(() => PromisE.delay(50, 1)),
            deferredFn(() => PromisE.delay(50, 2)),
            deferredFn(() => PromisE.delay(50, 3)),
        ])
        await vi.runAllTimersAsync()
        const results = await all
        expect(results).toEqual([3, 3, 3])
        expect(context.data.results).toEqual([3])
        expect(context.data.errors).toHaveLength(0)
        expect(context.data.results).toHaveLength(1)
        expect(context.data.ignored).toHaveLength(2)
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
        await vi.runAllTimersAsync()
        const results = await all
        expect(results).toEqual([1, undefined, 3])
    })

    it('should leading-edge debounce calls and only execute first & last and ignored will never resolve', async () => {
        const context = getDeferredContext()
        context.resolveIgnored = ResolveIgnored.NEVER
        context.leading = true
        const deferredFn = PromisE.deferred(context)

        deferredFn(() => PromisE.delay(50, 1))
        deferredFn(() => PromisE.delay(50, 2))
        deferredFn(() => PromisE.delay(50, 3))
        deferredFn(() => PromisE.delay(50, 4))
        deferredFn(() => PromisE.delay(50, 5))
        const last = deferredFn(() => PromisE.delay(5000, 6))
        await vi.runAllTimersAsync()
        expect(await last).toBe(6)
        expect(context.data.results).toEqual([1, 6])
        // onIgnore called twice for 2 first that were ignored
        expect(context.data.ignored).toHaveLength(4)
    })

    it('should handle failed promises and resolve: 1. with `undefined` 2. with `reason` and 3. never', async () => {
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
            await vi.runAllTimersAsync()
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
        const context = getDeferredContext()
        context.resolveIgnored = ResolveIgnored.WITH_LAST
        context.throttle = true
        const deferredFn = PromisE.deferred(context)
        const executionOrder: number[] = []
        const all = Promise.all(
            new Array(3).fill(0).map((_, i) =>
                deferredFn(() => {
                    executionOrder.push(i + 1)
                    return PromisE.delay(50, i + 1)
                })
            )
        )
        await vi.runAllTimersAsync()
        await all

        expect(executionOrder).toEqual([1, 3])
        expect(context.data.results).toContain(1)
        expect(context.data.results).toContain(3)
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
        await vi.runAllTimersAsync()
        const results = await all

        expect(results).toContain(3)
        const numIgnored = results
            .filter(x => x === undefined)
            .length
        expect(numIgnored).toBe(2)
    })

    it('should bind callbacks to thisArg and invoke callbacks: onResult, onError & onIgnore callbacks', async () => {
        const context = getDeferredContext()

        const deferredFn = PromisE.deferred(context)
        deferredFn(() => PromisE.delay(50, 1))
        deferredFn(() => PromisE.delay(50, 2))
        await vi.runAllTimersAsync()
        deferredFn(() => PromisE.delayReject(50, 'error')).catch(() => { })
        await vi.runAllTimersAsync()

        expect(context.data.results).toHaveLength(1)
        expect(context.data.errors).toHaveLength(1)
        expect(context.data.errors[0]).toBe('error')
        expect(context.data.ignored).toHaveLength(1)
    })

    it('should allow setting defaultResolveIgnored', () => {
        PromisE.defaultResolveIgnored = ResolveIgnored.NEVER
        expect(PromisE.defaultResolveIgnored).toBe(ResolveIgnored.NEVER)
    })
})
