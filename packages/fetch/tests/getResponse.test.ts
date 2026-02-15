import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type FetchArgs } from '../src'
import getResponse from '../src/getResponse'
import { productsBaseUrl } from './utils'

describe('getResponse', () => {
	const product1Url = `${productsBaseUrl}/1`
	const getMockedFetch = (success = true, status = 200) =>
		vi.fn(async (...args: FetchArgs) => ({
			ok: success,
			status,
			json: async () => ({
				success,
				args,
			}),
		}))
	let mockedFetch: undefined | ((...args: FetchArgs) => Promise<any>)

	afterEach(() => {
		vi.useRealTimers()
	})

	beforeEach(() => {
		vi.useFakeTimers()
		vi.unstubAllGlobals()
	})

	it('should return response without retrying', async () => {
		mockedFetch = getMockedFetch()
		vi.stubGlobal('fetch', mockedFetch!)
		const promsie = getResponse(product1Url)
		await vi.runAllTimersAsync()
		const response = await promsie
		await vi.runAllTimersAsync()
		const result = await response.json()
		expect(result).toEqual({
			success: true,
			args: [product1Url, {}],
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
		vi.stubGlobal('fetch', mockedFetch!)
		const options = { retry: 5, retryIf }
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

	it('should avoid retry when request is aborted', async () => {
		const retryIf = vi.fn(() => true)
		mockedFetch = vi.fn(async () => {
			throw new Error('Dummy error')
		})
		vi.stubGlobal('fetch', mockedFetch)

		const options = {
			abortCtrl: new AbortController(),
			retry: 5,
			retryIf,
		}
		options.abortCtrl.abort()
		const promise = getResponse(product1Url, options)
		promise.catch(() => {}) // avoid unhandled rejection)
		await vi.runAllTimersAsync()
		await expect(promise).rejects.toEqual(expect.any(Error))
		// await vi.runAllTimersAsync()
		// const result = await response.json()
		// expect(result).toEqual({
		// 	success: true,
		// 	args: [product1Url, options],
		// })
		// expect(mockedFetch).toHaveBeenCalledTimes(3)
		// expect(retryIf).toHaveBeenCalledTimes(3)
	})
})
