import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isObj, isStr, objSort } from '@superutils/core'
import PromisE from '@superutils/promise/src'
import { getDeferredContext } from '@superutils/promise/tests/getDeferredContext'
import fetch, { postDeferred, mergeFetchOptions } from '../src'

describe('postDeferred', () => {
	let mockPost200: ReturnType<typeof vi.fn>
	const fetchBaseUrl = 'https://dummyjson.com/products'
	let mockedResponse: Record<string, unknown> | undefined
	const getMockedPostResult = (
		productId: number,
		options: Record<string, any> = {},
		success = true,
		withSignal = true,
	) => ({
		// if response/data is not mocked, simply return the fetch args and success
		args: [
			`${fetchBaseUrl}/${productId}`,
			mergeFetchOptions(
				fetch.defaults,
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
		success,
	})

	beforeEach(() => {
		mockPost200 = vi.fn((url: any, options: any) =>
			Promise.resolve({
				ok: true,
				status: 200,
				json: () =>
					Promise.resolve(
						isObj(mockedResponse)
							? mockedResponse
							: {
									args: [
										url,
										// sort for consistency
										objSort(options),
									],
									success: true,
								},
					),
			}),
		)
		vi.stubGlobal('fetch', mockPost200)

		vi.useFakeTimers()
	})

	afterEach(() => {
		mockPost200.mockClear()
		vi.unstubAllGlobals()

		vi.useRealTimers()
	})

	it('should make a post request and return json result', async () => {
		const fetch200 = vi.fn((...args: any[]) =>
			Promise.resolve({
				ok: true,
				status: 200,
				json: () => ({
					age: 33,
					id: 'adam',
					location: 'heaven',
					name: 'Adam',
				}),
			}),
		)
		vi.stubGlobal('fetch', fetch200)
		const promise = fetch.post(`${fetchBaseUrl}`, { id: 'adam' })
		await vi.runAllTimersAsync()
		await expect(promise).resolves.toEqual({
			age: 33,
			id: 'adam',
			location: 'heaven',
			name: 'Adam',
		})
		expect(fetch200).toHaveBeenCalledOnce()
	})

	it('should debounce post requests and only execute trailing calls', async () => {
		// This test will now use the mocked fetch.
		// 1. First 3 calls are made within 100ms. The first 2 are ignored. The 3rd is queued.
		// 2. runAllTimersAsync executes the 3rd call.
		// 3. The 4th call is made, which is queued.
		const context = getDeferredContext()
		const saveProduct = postDeferred(context)
		saveProduct(`${fetchBaseUrl}/1`, { name: 'Product 1' })
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

	it('should debounce post requests and use global data', async () => {
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
		saveProduct()
		saveProduct()
		delay = PromisE.delay(100)
		vi.runAllTimersAsync()
		await delay
		expect(mockPost200).toHaveBeenCalledTimes(2)
		expect(context.data.results).toHaveLength(2)
		const result = getMockedPostResult(1, { body: { name: 'Product 1' } })
		expect(context.data.results).toEqual([result, result])
	})

	it('should test refresh token example', async () => {
		const context = getDeferredContext()
		// mocked response data
		const mockResponses = new Array(3).fill(0).map((_, i) => ({
			accessToken: `auto-${i}`,
			refreshToken: `refresh-${i}`,
		}))
		const tokens = {
			accessToken: '',
			refreshToken: '',
		}

		// Create a debounced function to refresh the auth token.
		// It waits 300ms after the last call before executing.
		const refreshAuthToken = fetch.post.deferred(
			{
				...context,
				onResult: (result: { token: string }) => {
					tokens.refreshToken = result.token
					context.onResult?.call(context, result)
				},
				thisArg: context,
			},
			'https://dummyjson.com/auth/refresh', // Default URL
		)

		// This function would be called from various parts of an app,
		// for example, in response to multiple failed API calls.
		function requestNewToken() {
			const body = {
				refreshToken: tokens.refreshToken,
				expiresInMins: 30,
			}
			return refreshAuthToken(body)
		}

		// set the first mocked reponse
		mockedResponse = mockResponses[0]
		const promise1 = requestNewToken() // Called at 0ms
		await vi.runAllTimersAsync()

		mockedResponse = mockResponses[1]
		const promise2 = PromisE.delay(10, requestNewToken) // Called at 50ms
		await vi.runAllTimersAsync()

		mockedResponse = mockResponses[2]
		const promise3 = PromisE.delay(200, requestNewToken) // Called at 100ms
		await vi.runAllTimersAsync()

		const results = await Promise.all([promise1, promise2, promise3])
		expect(results).toEqual(context.data.results)
	})
})
