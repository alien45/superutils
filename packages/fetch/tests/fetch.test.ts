import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PromisE from '@superutils/promise'
import fetch, {
	FetchAs,
	FetchError,
	FetchInterceptorError,
	FetchInterceptorRequest,
	FetchInterceptorResponse,
	FetchInterceptorResult,
	FetchInterceptors,
	FetchOptions,
} from '../src'
import { productsBaseUrl as baseUrl, getMockedResult } from './utils'
import { fallbackIfFails, noop } from '@superutils/core'

describe('fetch', () => {
	const product1Url = `${baseUrl}/1`
	let mockedFetch
	const mockedResult = { id: 1, title: 'mocked product' }
	const okResponse = {
		ok: true,
		status: 200,
		json: () => Promise.resolve(mockedResult),
	}

	afterEach(() => {
		vi.useRealTimers()
		vi.unstubAllGlobals()
	})

	beforeEach(() => {
		// Mock the global fetch to avoid real network requests
		mockedFetch = vi.fn(() => Promise.resolve({ ...okResponse }))
		vi.stubGlobal('fetch', mockedFetch)
		vi.useFakeTimers()
	})

	describe('general', () => {
		it('should return `Response` by default', async () => {
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
			vi.stubGlobal('fetch', fetch200)
			const promise = fetch<Response>(product1Url)
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
			let error: FetchError
			const handleErr = vi.fn((err: FetchError) => (error = err))
			fetch.get(product1Url).catch(handleErr)
			await vi.runAllTimersAsync()
			expect(handleErr).toHaveBeenCalledWith(expect.any(FetchError))
			expect(error!.options).not.toBe(undefined)
			expect(error!.response).toBe(undefined)
			expect(error!.url).not.toBe(undefined)
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

			await expect(fetch.get(product1Url)).rejects.toEqual(
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
			fetch
				.get(product1Url)
				.catch((err: FetchError) => (error = err.clone(err.message)))
			await expect(fetch.get(product1Url)).rejects.toEqual(
				expect.any(FetchError),
			)
			expect(error?.message).toBe('Bad request')
			expect(fetch400).toHaveBeenCalledTimes(2)
		})

		it('should handle when no error message returned from server', async () => {
			const status = 400
			const fetch400 = vi.fn((...args: any[]) => {
				const errResponse = Response.error()
				Object.defineProperty(errResponse, 'status', { value: status })
				return errResponse
			})

			vi.stubGlobal('fetch', fetch400)

			let error: FetchError | undefined
			fetch.get(product1Url, {}).catch((err: FetchError) => (error = err))
			await expect(fetch.get(product1Url)).rejects.toEqual(
				expect.any(FetchError),
			)
			expect(error?.message).toBe(
				`${fetch.defaults.errMsgs.requestFailed} ${status}`,
			)
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
			const promise = fetch.get(product1Url)
			await vi.runAllTimersAsync()
			await expect(promise).resolves.toEqual({
				age: 33,
				id: 'adam',
				location: 'heaven',
				name: 'Adam',
			})
			expect(fetch200).toHaveBeenCalledOnce()
		})

		it('should merge options global and local options', async () => {
			let receivedOptions: FetchOptions | undefined
			const localOptions = {
				as: FetchAs.json,
				headers: {
					'content-type': 'something else',
				},
				interceptors: {
					error: [vi.fn()],
					request: [
						vi.fn((_url, options) => {
							receivedOptions = options
						}),
					],
					response: [vi.fn()],
					result: [vi.fn()],
				},
				method: 'post',
			} as FetchOptions
			const {
				args: [_, expectedOptions],
			} = getMockedResult('get', 1, localOptions)
			await fetch(product1Url, localOptions)
			expect(receivedOptions).toEqual(expectedOptions)

			const interceptorKeys = [
				'request',
				'response',
				'result',
			] as (keyof FetchInterceptors)[]

			// make sure all interceptors (except for error) have been called
			;[fetch.defaults?.interceptors, localOptions?.interceptors]
				.map(interceptors =>
					interceptorKeys.map(key => interceptors?.[key] || []),
				)
				.flat(2)
				.forEach(interceptor =>
					expect(interceptor).toHaveBeenCalledOnce(),
				)
		})

		it('should abort a request externally and execute onEarlyFinalize callbacks', async () => {
			const onEarlyFinalize = vi.fn()
			const onReject = vi.fn()
			const onResolve = vi.fn()
			const request = fetch('https://dummyjson.com/products?delay=5000')
			// resolve/reject the before the promise is finalized
			request.onEarlyFinalize.push(onEarlyFinalize)
			request.reject('No longer needed')
			request.then(onResolve, onReject)
			await vi.runAllTimersAsync()
			expect(onReject).toHaveBeenCalledExactlyOnceWith('No longer needed')
			expect(onResolve).not.toHaveBeenCalled()
			expect(onEarlyFinalize).toHaveBeenCalled()
		})
	})

	describe('interceptors', () => {
		it('should throw error when invalid URL is provided', async () => {
			const errorIntercepror = vi.fn()
			const promise = fetch('an invalid url', {
				interceptors: { error: [errorIntercepror] },
			})
			promise.catch(noop)
			await expect(promise).rejects.toThrow('Invalid URL')
			expect(errorIntercepror).toHaveBeenCalledOnce()
		})

		it('should receive correct request, result & response interceptor arguments', async () => {
			const receivedInterceptorArgs = {
				request: [] as unknown[],
				result: [] as unknown[],
				response: [] as unknown[],
			}
			const mockedInterceptors = {
				request: [
					(...args) => {
						receivedInterceptorArgs.request = args
					},
				] as FetchInterceptorRequest[],
				result: [
					(...args) => {
						receivedInterceptorArgs.result = args
					},
				] as FetchInterceptorResult[],
				response: [
					(...args) => {
						receivedInterceptorArgs.response = args
					},
				] as FetchInterceptorResponse[],
			}
			const options = {
				interceptors: mockedInterceptors,
			} as Omit<FetchOptions, 'method'>

			const { args: expectedArgs } = getMockedResult('get', 1, options) // to prepare expected options
			const promise = fetch.get(product1Url, options)
			await vi.runAllTimersAsync()
			await promise
			expect(receivedInterceptorArgs.request).toEqual(expectedArgs)
			expect(receivedInterceptorArgs.result).toEqual([
				mockedResult,
				...expectedArgs,
			])
			expect(receivedInterceptorArgs.response).toEqual([
				okResponse,
				...expectedArgs,
			])
		})

		it('should receive correct error interceptor arguments', async () => {
			let receivedArgs = [] as unknown[]
			const mockedInterceptors = {
				error: [
					(...args) => {
						receivedArgs = args
					},
				] as FetchInterceptorError[],
				request: [],
				response: [],
				result: [],
			}
			const options = {
				interceptors: mockedInterceptors,
			} as Omit<FetchOptions, 'method'>
			const { args: expectedArgs } = getMockedResult('get', 1, options) // to prepare expected options
			const url = 'an invalid url'
			expectedArgs[0] = url // override with invalid url
			await fetch.get(url, options).catch(noop)
			expect(receivedArgs).toEqual([
				expect.any(FetchError),
				...expectedArgs,
			])
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
			const promise = fetch.get(product1Url, {
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
				.get(product1Url, {
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
				.get(product1Url, {
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
			const fetchNetworkError = vi.fn(() =>
				Promise.reject(new Error('Failed to fetch')),
			)
			vi.stubGlobal('fetch', fetchNetworkError)

			const onError = vi.fn()
			const promise = fetch
				.get(product1Url, {
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
			expect(fetchNetworkError).toHaveBeenCalledTimes(4) // 3 retries + first call
		})
	})

	describe('timeout & abort', () => {
		it('should reject after timeout', async () => {
			mockedFetch = vi.fn(async (url, { timeout }) => {
				const abortError = new Error('The user aborted a request.')
				abortError.name = 'AbortError'
				return PromisE.delayReject(timeout, abortError)
			})
			vi.stubGlobal('fetch', mockedFetch)
			const promise = fetch.get(product1Url, {
				timeout: -1, // test invalid value => falls back to default
			})
			promise.catch(noop) // avoid unhandled rejection
			await vi.advanceTimersByTimeAsync(fetch.defaults.timeout)
			expect(mockedFetch).toHaveBeenCalled()
			await expect(promise).rejects.toEqual(expect.any(FetchError))
		})

		it('should abort the fetch request when promise is resolved before finalization', async () => {
			const mockedFetch = vi.fn(() => PromisE.delay(10_000, okResponse))
			vi.stubGlobal('fetch', mockedFetch)
			const promise = fetch.get(product1Url, { timeout: 5000 })
			const cbIndex = promise.onEarlyFinalize.length
			promise.onEarlyFinalize.push(vi.fn())
			await vi.advanceTimersByTimeAsync(1_000)
			promise.resolve('resolved early')
			await expect(promise).resolves.toBe('resolved early')
			expect(promise.onEarlyFinalize[cbIndex]).toHaveBeenCalled()
			expect(mockedFetch).toHaveBeenCalledTimes(1)
			// request did not reject beause of abort
			expect(promise.aborted).toBe(false)
			// abortCtrl aborted because of early finalization
			expect(promise.abortCtrl?.signal.aborted).toBe(true)
		})

		it('should abort the fetch request externally', async () => {
			const mockedFetch = vi.fn(() => {
				return PromisE.delay(10_000, okResponse)
			})
			const promise = fetch.get(product1Url, {
				fetchFunc: mockedFetch as any,
				timeout: 5000,
			})
			promise.catch(() => {}) // avoid unhandled rejection
			promise.abortCtrl.abort()
			await vi.advanceTimersByTimeAsync(100)
			await expect(promise).rejects.toEqual(expect.any(Error))
			const err: FetchError = await fallbackIfFails(
				promise,
				[],
				(err: Error) => err,
			)
			expect(err).instanceOf(Error) // should be FetchError
			expect(mockedFetch).toHaveBeenCalledTimes(1)
			expect(promise.aborted).toBe(true)
			expect(promise.abortCtrl?.signal.aborted).toBe(true)
		})
	})
})
