import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import fetch, { FetchOptions, type FetchArgs } from '../src'
import getResponse from '../src/getResponse'
import { getMockedFetch, productsBaseUrl } from './utils'

describe('getResponse', () => {
	const product1Url = `${productsBaseUrl}/1`
	let mockedFetch: undefined | ((...args: FetchArgs) => Promise<any>)

	afterEach(() => {
		vi.useRealTimers()
	})

	beforeEach(() => {
		vi.useFakeTimers()
		vi.unstubAllGlobals()
	})

	it('should avoid circular referencing when `globalThis.fetch` is set to local `fetch`', async () => {
		const fetchOriginal = globalThis.fetch
		globalThis.fetch = fetch

		const mockedFetch = getMockedFetch()
		vi.stubGlobal('fetch', mockedFetch)
		await expect(() =>
			globalThis.fetch(product1Url, { timeout: 3000 } as any),
		).not.toThrow()
		globalThis.fetch = fetchOriginal
	})

	it('should use `globalThis.fetch` when `fetchFunc` is not provided', async () => {
		const fOrg = globalThis.fetch

		getResponse.fetch = getMockedFetch() as any
		await expect(() => getResponse(product1Url)).not.toThrow()

		expect(getResponse.fetch).toHaveBeenCalled()
		globalThis.fetch = fOrg
	})

	it('should return response without retrying', async () => {
		mockedFetch = getMockedFetch()
		const promsie = getResponse(product1Url, { fetchFunc: mockedFetch })
		await vi.runAllTimersAsync()
		const response = await promsie
		await vi.runAllTimersAsync()
		const result = await response.json()
		expect(mockedFetch).toHaveBeenCalled()
		expect(result).toEqual({
			args: [product1Url, { fetchFunc: mockedFetch }],
			success: true,
		})
	})

	it('should retry when request fails', async () => {
		let count = 0
		const retryIf = vi.fn()
		mockedFetch = vi.fn(async (...args: FetchArgs) => {
			count++
			if (count < 3) throw new Error('Network error')

			const response = await getMockedFetch(true, 200)(...args)
			return response
		})
		const options = { fetchFunc: mockedFetch, retry: 5, retryIf }
		const promsie = getResponse(product1Url, options)
		await vi.runAllTimersAsync()
		const response = await promsie
		await vi.runAllTimersAsync()
		const result = await response.json()
		expect(result).toEqual({
			success: true,
			args: [product1Url, options],
		})
		expect(mockedFetch).toHaveBeenCalledTimes(3)
		expect(retryIf).toHaveBeenCalledTimes(3)
	})

	it('should avoid retry when abortCtrl is aborted', async () => {
		const retryIf = vi.fn(() => true)
		const handleErr = vi.fn()
		mockedFetch = vi.fn(async () => {
			throw new Error('Dummy error')
		})
		const options: FetchOptions = {
			abortCtrl: new AbortController(),
			fetchFunc: mockedFetch,
			retry: 5,
			retryIf,
		}
		options.abortCtrl?.abort()
		const promise = getResponse(product1Url, options).catch(handleErr)
		await vi.runAllTimersAsync()
		await promise
		expect(handleErr).toBeCalledTimes(1)
		expect(retryIf).not.toBeCalled()
	})

	it('should avoid retry when signal is aborted', async () => {
		const retryIf = vi.fn(() => true)
		const handleErr = vi.fn()
		mockedFetch = vi.fn(async () => {
			throw new Error('Dummy error')
		})

		const abortCtrl = new AbortController()
		abortCtrl.abort()
		const options: FetchOptions = {
			fetchFunc: mockedFetch,
			retry: 5,
			retryIf,
			signal: abortCtrl.signal,
		}
		const promise = getResponse(product1Url, options).catch(handleErr)
		await vi.runAllTimersAsync()
		await promise
		expect(handleErr).toBeCalledTimes(1)
		expect(retryIf).not.toBeCalled()
	})
})
