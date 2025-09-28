import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest'
import PromisE from '../src'

describe('fetchResponse', () => {
    const fetchBaseUrl = 'https://dummyjson.com/products'

    beforeEach(() => {
        // Mock the global fetch to avoid real network requests
        vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('should throw error when invalid URL is provided', async () => {
        const promise = PromisE.fetchResponse('invalid url')
        await expect(promise)
            .rejects
            .toThrow('Invalid URL')
    })

    it('should fail fetch with 500', async () => {
        const fetch500 = vi.fn((...args: any[]) => Promise.resolve({
            ok: false,
            status: 500,
            json: () => Promise.resolve({
                success: false,
                message: 'Internal Server Error',
                args,
            }),
        }))
        vi.stubGlobal('fetch', fetch500)
        const promise = PromisE.fetchResponse(`${fetchBaseUrl}`)
        await expect(promise)
            .rejects
            .toThrow('Internal Server Error')
    })

    it('should handle AbortError from fetch and throw "Request timed out"', async () => {
        const abortError = new Error('The user aborted a request.')
        abortError.name = 'AbortError'
        const fetchAbortedMock = vi.fn().mockRejectedValue(abortError)
        vi.stubGlobal('fetch', fetchAbortedMock)

        const promise = PromisE.fetchResponse(`${fetchBaseUrl}`)
        await expect(promise)
            .rejects
            .toThrow('Request timed out')
        expect(fetchAbortedMock).toHaveBeenCalled()
    })

    it('should handle fetch fail with no error message', async () => {
        const fetch500 = vi.fn(() => Promise.resolve({
            ok: false,
            status: 0,
            json: () => Promise.resolve(), // no message, empty JSON
        }))
        vi.stubGlobal('fetch', fetch500)

        const promise = PromisE.fetchResponse(`${fetchBaseUrl}`)
        await expect(promise)
            .rejects
            .toThrow('Request failed with status code 0.')
        expect(fetch500).toHaveBeenCalled()
    })
})