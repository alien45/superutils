import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest'
import PromisE from '../src'
import { getDeferredContext } from './deferred.test'

describe('deferredFetch', () => {
    let mockFetch200: ReturnType<typeof vi.fn>
    const fetchBaseUrl = 'https://dummyjson.com/products'
    const getMockedFetchResult = (
        productId: number,
        options: Record<string, any> = {},
        success = true
    ) => ({
        success,
        args: [
            `${fetchBaseUrl}/${productId}`,
            {
                ...options,
                headers: {
                    'content-type': 'application/json',
                    ...options?.headers
                },
                method: options?.method ?? 'get',
                signal: expect.any(AbortSignal)
            }
        ]
    })

    beforeEach(() => {
        mockFetch200 = vi.fn((...args: any[]) => Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ success: true, args }),
        }))
        vi.stubGlobal('fetch', mockFetch200)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.unstubAllGlobals()

        vi.useRealTimers()
    })

    it('should debounce fetch calls and only execute trailing calls', async () => {
        // This test will now use the mocked fetch.
        // - Default fetch url is set to `${productsBaseUrl}/1`
        // - 3 calls are made within 100ms. 
        // - 1st is called using default url. 2nd & 3rd are called by overriding default URL.
        // - The first 2 are ignored. The 3rd is queued.
        // - runAllTimersAsync executes only the 3rd call.
        const context = getDeferredContext()
        const headers = { 'x-header': 'some header' }
        const getProduct = PromisE.deferredFetch(
            context,
            `${fetchBaseUrl}/1`, // default url
            { headers }
        )
        getProduct()
        await vi.runAllTimersAsync()
        getProduct(`${fetchBaseUrl}/2`)
        const last = getProduct(
            `${fetchBaseUrl}/3`,
            {},
            5000,
            new AbortController(),
        )
        await vi.runAllTimersAsync() // Executes the last call

        expect(mockFetch200).toHaveBeenCalledTimes(2) // only the last call is executed
        expect(context.data.results).toHaveLength(2)
        expect(context.data.ignored).toHaveLength(1) // First two calls are ignored
        expect(context.data.errors).toHaveLength(0)

        const firstResult = getMockedFetchResult(1, { headers })
        const lastResult = getMockedFetchResult(3, { headers })
        // All resolved promises should have the mocked result
        expect(context.data.results).toEqual([firstResult, lastResult])
        await expect(last).resolves.toEqual(lastResult)
    })

    it('should debounce fetch calls and only execute trailing calls', async () => {
        // This test will now use the mocked fetch.
        // - Default fetch url is set to `${productsBaseUrl}/1`
        // - 3 calls are made within 100ms. 
        // - 1st is called using default url. 2nd & 3rd are called by overriding default URL.
        // - The first 2 are ignored. The 3rd is queued.
        // - runAllTimersAsync executes only the 3rd call.
        const context = getDeferredContext()
        const headers = { 'x-header': 'some header' }
        const getProduct = PromisE.deferredFetch(
            context,
            `${fetchBaseUrl}/1`, // default url
            { headers }
        )
        getProduct()
        await vi.runAllTimersAsync()
        getProduct(`${fetchBaseUrl}/2`)
        const last = getProduct(
            `${fetchBaseUrl}/3`,
            {},
            5000,
            new AbortController(),
        )
        await vi.runAllTimersAsync() // Executes the last call

        expect(mockFetch200).toHaveBeenCalledTimes(2) // only the last call is executed
        expect(context.data.results).toHaveLength(2)
        expect(context.data.ignored).toHaveLength(1) // First two calls are ignored
        expect(context.data.errors).toHaveLength(0)

        const firstResult = getMockedFetchResult(1, { headers })
        const lastResult = getMockedFetchResult(3, { headers })
        // All resolved promises should have the mocked result
        expect(context.data.results).toEqual([firstResult, lastResult])
        await expect(last).resolves.toEqual(lastResult)
    })
})