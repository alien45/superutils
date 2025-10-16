import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PromisE from '@superutils/promise'
import fetcher, { config, FetchError } from '../src'

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

	it('should throw error when invalid URL is provided', async () => {
		const errorIntercepror = vi.fn()
		const promise = fetcher('invalid url', {
			interceptors: { error: [errorIntercepror] },
		})
		await expect(promise).rejects.toThrow('Invalid URL')
		expect(errorIntercepror).toHaveBeenCalledOnce()
	})

	it('should fail fetch with 500', async () => {
		const retry = 3
		const fetch500 = vi.fn((...args: any[]) => {
			return Promise.resolve({
				ok: false,
				status: 500,
				json: () =>
					Promise.resolve({
						success: false,
						message: 'Internal Server Error',
						args,
					}),
			})
		})
		vi.stubGlobal('fetch', fetch500)
		let error: FetchError | undefined
		const promise = fetcher(`${fetchBaseUrl}`, {
			retry,
			retryBackOff: 'exponential',
			retryDelayJitter: true,
			retryDelay: 300,
		}).catch(err => (error = err))
		// 300 + 600 + 1200 + execution time (4 attempts) = ~2600 ms
		await vi.runAllTimersAsync()
		await promise
		expect(fetch500).toHaveBeenCalledTimes(retry + 1) // total number of expected attempts
		expect(error).toBeInstanceOf(FetchError)
		expect((error?.cause as Error)?.message).toEqual(
			'Internal Server Error',
		)
	})

	it('should reject after timeout', async () => {
		mockedFetch = vi.fn(async (url, { timeout = 0 }) => {
			const abortError = new Error('The user aborted a request.')
			abortError.name = 'AbortError'
			return PromisE.delayReject(timeout, abortError)
		})
		vi.stubGlobal('fetch', mockedFetch)

		const onError = vi.fn()
		const promise = fetcher(`${fetchBaseUrl}`, {
			retry: 0,
			timeout: 10_000,
		}).catch(onError)
		await vi.runAllTimersAsync()
		await promise
		expect(mockedFetch).toHaveBeenCalled()
		expect(onError).toHaveBeenCalledWith(expect.any(FetchError))
	})

	it('should handle fetch fail due to network issues', async () => {
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
		const promise = fetcher(`${fetchBaseUrl}`, {
			retry: 3,
			retryBackOff: 'linear',
			retryDelayJitter: true,
			retryDelay: 300,
		}).catch(onError)
		await vi.advanceTimersByTimeAsync(2000)
		await promise
		expect(onError).toHaveBeenNthCalledWith(1, expect.any(FetchError))
		expect(fetchNetworkError).toHaveBeenCalled()
		expect(MockResponse).toHaveBeenCalledTimes(4) // 3 retries + first call
	})

	it('should handle parse failure', async () => {
		const fetchMock = vi.fn(async () => ({
			ok: true,
			status: 200,
			json: async () => Promise.reject('JSON parse error!'),
		}))
		vi.stubGlobal('fetch', fetchMock)

		const promise = fetcher(`${fetchBaseUrl}`)
		const {
			as: parseAs,
			errMsgs: { parseFailed },
		} = config.fetchOptions
		expect(1).toBe(1)
		await expect(promise).rejects.toThrow(
			`${parseFailed} ${parseAs}. JSON parse error!`,
		)
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
		const promise = fetcher(`${fetchBaseUrl}`, { timeout: 5000 })
		promise.onEarlyFinalize = promise.onEarlyFinalize.map(fn => vi.fn(fn))
		await vi.advanceTimersByTimeAsync(1_000)
		promise.resolve('resolved early')
		await vi.runAllTimersAsync()
		await expect(promise).resolves.toBe('resolved early')
		expect(promise.onEarlyFinalize[0]).toHaveBeenCalled()
		vi.useRealTimers()
	})

	it('should execute interceptors and transform result', async () => {
		const { interceptors } = config.fetchOptions
		let midResult: string | undefined
		const mockedIntercepros = {
			request: [vi.fn()],
			result: [
				vi.fn(() => 'modified result'), // transform result
				vi.fn(async result => {
					midResult = result as string
					// does not transform result when value is not returned or error is thrown.
					// will keep the previous result
					throw new Error('meh')
				}),
				vi.fn(() => 'modified result again'), // transform result
			],
			response: [vi.fn()],
		}
		config.fetchOptions.interceptors = mockedIntercepros as any
		const promise = fetcher(`${fetchBaseUrl}`)
		const result = await promise
		expect(midResult).toBe('modified result')
		expect(result).toBe('modified result again')
		expect(mockedIntercepros.request[0]).toBeCalled()
		expect(mockedIntercepros.result[0]).toBeCalled()
		expect(mockedIntercepros.response[0]).toBeCalled()
		config.fetchOptions.interceptors = interceptors
	})
})
