import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PromisE from '@superutils/promise'
import fetch, { FetchAs, FetchError } from '../src'

describe('fetch', () => {
	const fetchBaseUrl = 'https://dummyjson.com/products'
	let mockedFetch

	afterEach(() => {
		vi.useRealTimers()
		vi.unstubAllGlobals()
	})

	beforeEach(() => {
		// Mock the global fetch to avoid real network requests
		mockedFetch = vi.fn(() =>
			Promise.resolve({
				ok: true,
				status: 200,
				json: () => Promise.resolve(),
			}),
		)
		vi.stubGlobal('fetch', mockedFetch)
		vi.useFakeTimers()
	})

	it(`should handle "Failed to execute 'fetch' on 'Window'"`, async () => {
		const fetchMock = vi.fn(async () =>
			Promise.reject(
				new TypeError(
					`TypeError: Failed to execute 'fetch' on 'Window'`,
				),
			),
		)
		vi.stubGlobal('fetch', fetchMock)

		await vi.runAllTimersAsync()
		await expect(fetch.get(fetchBaseUrl)).rejects.toThrow(
			`TypeError: Failed to execute 'fetch' on 'Window'`,
		)
	})

	it('should handle parse error', async () => {
		const fetch200 = vi.fn((...args: any[]) =>
			Promise.resolve({
				ok: true,
				status: 200,
				json: () => Promise.reject(new Error('Parse error')),
			}),
		)
		vi.stubGlobal('fetch', fetch200)

		await expect(fetch.get(fetchBaseUrl)).rejects.toEqual(
			expect.any(FetchError),
		)
		expect(fetch200).toHaveBeenCalledOnce()
	})

	it('should handle error returned from server', async () => {
		const fetch400 = vi.fn((...args: any[]) =>
			Promise.resolve({
				ok: false,
				status: 400,
				json: () => ({
					message: 'Bad request',
				}),
			}),
		)
		vi.stubGlobal('fetch', fetch400)

		let error: FetchError | undefined
		fetch.get(fetchBaseUrl).catch(err => (error = err))
		await expect(fetch.get(fetchBaseUrl)).rejects.toEqual(
			expect.any(FetchError),
		)
		expect(error?.message).toBe('Bad request')
		expect(fetch400).toHaveBeenCalledTimes(2)
	})

	it('should return successful response parsed as JSON by default', async () => {
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
		const promise = fetch.get(fetchBaseUrl)
		await vi.runAllTimersAsync()
		await expect(promise).resolves.toEqual({
			age: 33,
			id: 'adam',
			location: 'heaven',
			name: 'Adam',
		})
		expect(fetch200).toHaveBeenCalledOnce()
	})

	it('should return successful response as Response by modifying default in `fetch.defaults.as`', async () => {
		const fetch200 = vi.fn((...args: any[]) =>
			Promise.resolve(
				new Response(
					JSON.stringify({
						age: 33,
						id: 'adam',
						location: 'heaven',
						name: 'Adam',
					}),
					{
						status: 200,
						headers: { 'Content-Type': 'application/json' },
					},
				),
			),
		)
		const asOriginal = fetch.defaults.as
		fetch.defaults.as = FetchAs.response
		vi.stubGlobal('fetch', fetch200)
		const promise: Promise<Response> = fetch.get(fetchBaseUrl)
		await vi.runAllTimersAsync()
		const response = await promise
		expect(response).instanceOf(Response)
		await expect(response.json()).resolves.toEqual({
			age: 33,
			id: 'adam',
			location: 'heaven',
			name: 'Adam',
		})
		expect(fetch200).toHaveBeenCalledOnce()
		fetch.defaults.as = asOriginal
	})

	describe('interceptors', () => {
		it('should throw error when invalid URL is provided', async () => {
			const errorIntercepror = vi.fn()
			const promise = fetch('some invalid url', {
				interceptors: { error: [errorIntercepror] },
			})
			await expect(promise).rejects.toThrow('Invalid URL')
			expect(errorIntercepror).toHaveBeenCalledOnce()
		})

		it('should execute interceptors and transform result', async () => {
			const { interceptors } = fetch.defaults
			let secondResult: string | undefined
			const mockedInterceptors = {
				error: [],
				request: [vi.fn()],
				result: [
					vi.fn(() => 'modified result'), // transform result
					vi.fn(async result => {
						secondResult = result as string
						// does not transform result when value is not returned or error is thrown.
						// will keep the previous result
						throw new Error('meh')
					}),
					vi.fn(() => 'modified result again'), // transform result
				],
				response: [vi.fn()],
			}
			fetch.defaults.interceptors = mockedInterceptors
			const promise = fetch.get(fetchBaseUrl, {
				interceptors: mockedInterceptors,
			})
			await vi.runAllTimersAsync()
			const finalResult = await promise
			expect(secondResult).toBe('modified result')
			expect(finalResult).toBe('modified result again')
			expect(mockedInterceptors.request[0]).toBeCalled()
			expect(mockedInterceptors.result[0]).toBeCalled()
			expect(mockedInterceptors.response[0]).toBeCalled()
			fetch.defaults.interceptors = interceptors
		})
	})

	describe('retry', () => {
		it('should fail fetch with 500 with exponential retry', async () => {
			const retry = 3
			const fetch500 = vi.fn((...args: any[]) =>
				Promise.reject({
					ok: false,
					status: 500,
					message: 'Internal Server Error',
				}),
			)
			vi.stubGlobal('fetch', fetch500)
			let error: FetchError | undefined
			const promise = fetch
				.get(fetchBaseUrl, {
					retry,
					retryBackOff: 'exponential',
					retryDelayJitter: true,
					retryDelay: 300,
					retryIf: () => true,
				})
				.catch(err => (error = err))
			// 300 + 600 + 1200 + execution time (4 attempts) = ~2600 ms
			await vi.runAllTimersAsync()
			await promise
			expect(fetch500).toHaveBeenCalledTimes(retry + 1) // total number of expected attempts
			expect(error).toBeInstanceOf(FetchError)
			expect(error?.message).toBe(
				'Request failed after attempt #' + (retry + 1),
			)
			expect((error?.cause as Error)?.message).toEqual(
				'Internal Server Error',
			)
		})

		it('should retry until result is as expected by using `retryIf()`', async () => {
			let userCount = 0
			mockedFetch = vi.fn(() => {
				++userCount
				return Promise.resolve({
					ok: true,
					status: 200,
					json: async () => userCount,
				})
			})
			vi.stubGlobal('fetch', mockedFetch)

			const onError = vi.fn()
			const promise = fetch
				.get(fetchBaseUrl, {
					retry: 5,
					retryIf: async response => {
						const userCount = await response?.json()
						return userCount < 3 // wait until user count is 3
					},
				})
				.catch(onError)
			await vi.runAllTimersAsync()

			expect(mockedFetch).toHaveBeenCalled()
			await expect(promise).resolves.toEqual(3)
			await expect(promise).resolves.toEqual(userCount)
		})

		it('should handle fetch fail due to network issues with linear retry', async () => {
			// Mock the global Response constructor to allow status 0, which modern fetch polyfills disallow.
			const MockResponse = vi.fn(() => ({
				ok: false,
				status: 0,
				json: () => Promise.resolve(),
			}))
			vi.stubGlobal('Response', MockResponse)

			const fetchNetworkError = vi.fn(() =>
				Promise.reject(new Error('Failed to fetch')),
			)
			vi.stubGlobal('fetch', fetchNetworkError)

			const onError = vi.fn()
			const promise = fetch
				.get(fetchBaseUrl, {
					retry: 3,
					retryBackOff: 'linear',
					retryDelayJitter: true,
					retryDelay: 300,
					retryDelayJitterMax: 100,
				})
				.catch(onError)
			await vi.advanceTimersByTimeAsync(2000)
			await promise
			expect(onError).toHaveBeenNthCalledWith(1, expect.any(FetchError))
			expect(fetchNetworkError).toHaveBeenCalled()
			expect(MockResponse).toHaveBeenCalledTimes(4) // 3 retries + first call
		})
	})

	describe('timeout', () => {
		it('should reject after timeout', async () => {
			mockedFetch = vi.fn(async (url, { timeout = 0 }) => {
				const abortError = new Error('The user aborted a request.')
				abortError.name = 'AbortError'
				return PromisE.delayReject(timeout, abortError)
			})
			vi.stubGlobal('fetch', mockedFetch)

			const onError = vi.fn()
			const promise = fetch
				.get(fetchBaseUrl, {
					timeout: 10_000,
				})
				.catch(onError)
			await vi.runAllTimersAsync()
			await promise
			expect(mockedFetch).toHaveBeenCalled()
			expect(onError).toHaveBeenCalledWith(expect.any(FetchError))
		})

		it('should abort the fetch request when promise is resolved before finalization', async () => {
			vi.useFakeTimers()
			const mockedFetch = vi.fn(() =>
				PromisE.delay(10_000, {
					ok: true,
					status: 200,
					json: () => Promise.resolve('original value'),
				}),
			)
			vi.stubGlobal('fetch', mockedFetch)
			const promise = fetch.get(fetchBaseUrl, { timeout: 5000 })
			promise.onEarlyFinalize = promise.onEarlyFinalize.map(fn =>
				vi.fn(fn),
			)
			await vi.advanceTimersByTimeAsync(1_000)
			promise.resolve('resolved early')
			await vi.runAllTimersAsync()
			await expect(promise).resolves.toBe('resolved early')
			expect(promise.onEarlyFinalize[0]).toHaveBeenCalled()
			vi.useRealTimers()
		})
	})
})
