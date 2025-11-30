import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isStr, objSort } from '@superutils/core'
import PromisE from '@superutils/promise/src'
import { getDeferredContext } from '@superutils/promise/tests/deferred.test'
import { postDeferred, mergeFetchOptions } from '../src'

describe('post && postDeferred', () => {
	let mockPost200: ReturnType<typeof vi.fn>
	const fetchBaseUrl = 'https://dummyjson.com/products'
	const getMockedPostResult = (
		productId: number,
		options: Record<string, any> = {},
		success = true,
		withSignal = true,
	) => ({
		success,
		args: [
			`${fetchBaseUrl}/${productId}`,
			mergeFetchOptions(
				objSort({
					...(withSignal && {
						abortCtrl: expect.any(AbortController),
						signal: expect.any(AbortSignal),
					}),
					...options,
					body: isStr(options.body)
						? options.body
						: JSON.stringify(options.body),
					method: 'post',
				}),
			),
		],
	})

	beforeEach(() => {
		mockPost200 = vi.fn((url: any, options: any) =>
			Promise.resolve({
				ok: true,
				status: 200,
				json: () =>
					Promise.resolve({
						success: true,
						args: [
							url,
							// sort for consistency
							objSort(options),
						],
					}),
			}),
		)
		vi.stubGlobal('fetch', mockPost200)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.unstubAllGlobals()

		vi.useRealTimers()
	})

	it('should debounce post requests and only execute trailing calls', async () => {
		// This test will now use the mocked fetch.
		// 1. First 3 calls are made within 100ms. The first 2 are ignored. The 3rd is queued.
		// 2. runAllTimersAsync executes the 3rd call.
		// 3. The 4th call is made, which is queued.
		const context = getDeferredContext()
		const saveProduct = postDeferred(context, `${fetchBaseUrl}/1`)
		saveProduct(undefined, { name: 'Product 1' })
		let delay = PromisE.delay(100)
		await vi.runAllTimersAsync()
		await delay
		expect(mockPost200).toHaveBeenCalledTimes(1)
		expect(context.data.results).toHaveLength(1)
		saveProduct(`${fetchBaseUrl}/2`, { name: 'Product 2' })
		saveProduct(`${fetchBaseUrl}/2a`, { name: 'Product 2a' })
		saveProduct(`${fetchBaseUrl}/2b`, { name: 'Product 2b' })
		saveProduct(`${fetchBaseUrl}/3`, 'Product 3')
		delay = PromisE.delay(100)
		vi.runAllTimersAsync()
		await delay
		expect(mockPost200).toHaveBeenCalledTimes(2)
		expect(context.data.results).toHaveLength(2)
		const result1 = getMockedPostResult(1, { body: { name: 'Product 1' } })
		const result2 = getMockedPostResult(3, { body: 'Product 3' })
		expect(context.data.results).toEqual([result1, result2])
	})

	it('should debounce post requests and only execute trailing calls', async () => {
		const context = getDeferredContext()
		const saveProduct = postDeferred(context, `${fetchBaseUrl}/1`, {
			name: 'Product 1',
		})
		saveProduct()
		let delay = PromisE.delay(100)
		await vi.runAllTimersAsync()
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
		const result1 = getMockedPostResult(1, { body: { name: 'Product 1' } })
		const result2 = getMockedPostResult(3, { body: 'Product 3' })
		expect(context.data.results).toEqual([result1, result2])
	})
})
