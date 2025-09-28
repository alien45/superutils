import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getDeferredContext } from './deferred.test'
import PromisE from '../src'
import { isStr } from '@utiils/core'


describe('deferredPost', () => {
    let mockPost200: ReturnType<typeof vi.fn>
    const fetchBaseUrl = 'https://dummyjson.com/products'
    const getMockedPostResult = (
        productId: number,
        options: Record<string, any> = {},
        success = true,
    ) => ({
        success,
        args: [
            `${fetchBaseUrl}/${productId}`,
            {
                ...options,
                body: isStr(options.body)
                    ? options.body
                    : JSON.stringify(options.body),
                headers: {
                    'content-type': 'application/json',
                    ...options?.headers
                },
                method: 'post',
                signal: expect.any(AbortSignal)
            }
        ]
    })

    beforeEach(() => {
        mockPost200 = vi.fn((...args: any[]) => Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ success: true, args }),
        }))
        vi.stubGlobal('fetch', mockPost200)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.unstubAllGlobals()

        vi.useRealTimers()
    })

    it('should debounce post calls and only execute trailing calls', async () => {
        // This test will now use the mocked fetch.
        // 1. First 3 calls are made within 100ms. The first 2 are ignored. The 3rd is queued.
        // 2. runAllTimersAsync executes the 3rd call.
        // 3. The 4th call is made, which is queued.
        const context = getDeferredContext()
        const saveProduct = PromisE.deferredPost(context, `${fetchBaseUrl}/1`)

        saveProduct(undefined, { name: 'Product 1' })
        let delay = PromisE.delay(100)
        vi.runAllTimersAsync()
        await delay

        expect(mockPost200).toHaveBeenCalledTimes(1)
        expect(context.data.results).toHaveLength(1)

        saveProduct(`${fetchBaseUrl}/2`, { name: 'Product 2' })
        saveProduct(`${fetchBaseUrl}/3`, 'Product 3')
        delay = PromisE.delay(100)
        vi.runAllTimersAsync()
        await delay

        expect(mockPost200).toHaveBeenCalledTimes(2)
        expect(context.data.results).toHaveLength(2)
        expect(context.data.results).toEqual([
            getMockedPostResult(1, { body: { name: 'Product 1' } }),
            getMockedPostResult(3, { body: 'Product 3' }),
        ])
    })
})