import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fallbackIfFails, noop, objSort } from '../../core/src'
import PromisE from '../../promise/src'
import fetch, {
	FetchAs,
	FetchError,
	FetchInterceptorError,
	FetchInterceptorRequest,
	FetchInterceptorResponse,
	FetchInterceptorResult,
	FetchInterceptors,
	FetchOptions,
	GET_METHODS,
	POST_METHODS,
} from '../src'
import {
	productsBaseUrl as baseUrl,
	getMockedFetch,
	getMockedResult,
} from './utils'

describe('fetch', () => {
	const product1Url = `${baseUrl}/1`
	let mockedFetch
	const mockedResult = { id: 1, title: 'mocked product' }

	afterEach(() => {
		vi.useRealTimers()
		vi.unstubAllGlobals()
		fetch.defaults.fetchFunc = undefined
	})

	beforeEach(() => {
		// Mock the global fetch to avoid real network requests
		fetch.defaults.fetchFunc = getMockedFetch(
			true,
			200,
			'',
			mockedResult,
		) as any
		vi.useFakeTimers()
	})
	describe('general', () => {
		it('should contain methods and .deferred() functions', () => {
			const methodDescriptors = [...GET_METHODS, ...POST_METHODS].map(m =>
				Object.getOwnPropertyDescriptor(fetch, m.toLowerCase()),
			)
			for (const descriptor of methodDescriptors) {
				expect(descriptor?.enumerable).toBe(false)
				expect(descriptor?.writable).toBe(false)
				expect(descriptor?.value).toBeInstanceOf(Function)
				expect(descriptor?.value.deferred).toBeInstanceOf(Function)
			}
		})

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
			fetch.defaults.fetchFunc = fetch200
			const promise = fetch<Response>(product1Url, null as any)
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

		it('should accept Request instance', async () => {
			const mockedFetch = getMockedFetch()
			const request = new Request(product1Url)
			await expect(() =>
				fetch(request, { fetchFunc: mockedFetch }),
			).not.toThrow()
		})

		it(`should handle "Failed to execute 'fetch' on 'Window'"`, async () => {
			const mockFetchError = getMockedFetch(
				false,
				0,
				`TypeError: Failed to execute 'fetch' on 'Window'`,
			)
			fetch.defaults.fetchFunc = mockFetchError
			let error!: FetchError
			const handleErr = vi.fn((err: FetchError) => (error = err))
			fetch.get(undefined as any).catch(handleErr)
			await vi.runAllTimersAsync()
			expect(handleErr).toHaveBeenCalledWith(expect.any(FetchError))
			expect(error.options).not.toBe(undefined)
			expect(error.response).toBe(undefined)
			expect(error.url).toBe(undefined)
			expect(mockFetchError).toHaveBeenCalledOnce()
		})

		it('should handle parse error', async () => {
			const fetch200 = getMockedFetch(true, 200, 'Parse error')
			fetch.defaults.fetchFunc = fetch200
			await expect(fetch.get(product1Url)).rejects.toEqual(
				expect.any(FetchError),
			)
			expect(fetch200).toHaveBeenCalledOnce()
		})

		it('should use default error message when no message is returned from server', async () => {
			mockedFetch = vi.fn(() => ({})) as any
			await expect(
				fetch.get(product1Url, { fetchFunc: mockedFetch }),
			).rejects.toEqual(expect.any(FetchError))
			expect(mockedFetch).toHaveBeenCalledOnce()
		})

		it('should handle error returned from server', async () => {
			const fetch400 = getMockedFetch(false, 400, 'Bad request')
			fetch.defaults.fetchFunc = fetch400
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

			fetch.defaults.fetchFunc = fetch400 as any

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
			const entry = {
				age: 33,
				id: 'adam',
				location: 'heaven',
				name: 'Adam',
			}
			const fetch2001 = getMockedFetch(true, 200, undefined, entry)
			fetch.defaults.fetchFunc = fetch2001
			const promise = fetch.get(product1Url)
			await vi.runAllTimersAsync()
			await expect(promise).resolves.toEqual(entry)
			expect(fetch2001).toHaveBeenCalledOnce()
		})

		it('should merge options global and local options', async () => {
			let receivedOptions: FetchOptions | undefined
			const localOptions = {
				as: FetchAs.json,
				headers: {
					'content-type': 'something else',
				},
				ignoreGlobalDefaults: false,
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

		it('should invoke body function before executing request interceptors', async () => {
			const bodyFunc = vi.fn(() => ({ data: 1 }))
			const fetchFunc = getMockedFetch(true, 200, undefined, { data: 1 })
			fetch.defaults.fetchFunc = fetchFunc
			const promise = fetch.post(baseUrl, bodyFunc)

			await vi.runAllTimersAsync()
			await expect(promise).resolves.toEqual({ data: 1 })
			expect(bodyFunc).toHaveBeenCalledOnce()
			expect(fetchFunc).toHaveBeenCalledOnce()
		})
	})

	describe('interceptors', () => {
		it('should throw error when invalid URL is provided', async () => {
			const errorIntercepror = vi.fn()
			const handleErr = vi.fn()
			const promise = fetch.get('an invalid url', {
				interceptors: { error: [errorIntercepror] },
				validateUrl: true,
			})
			await promise.catch(handleErr)
			await expect(promise).rejects.toThrow('Invalid URL')
			expect(errorIntercepror).toHaveBeenCalledOnce()
			expect(handleErr).toHaveBeenCalledOnce()
		})
		it('should use string returned by error interceptor', async () => {
			const errorIntercepror = vi.fn(() => 'custom error')
			const promise = fetch.get('', {
				fetchFunc: () => Promise.reject(),
				interceptors: { error: [errorIntercepror as any] },
			})
			await promise.catch(noop)
			await expect(promise).rejects.toThrow('custom error')
			expect(errorIntercepror).toHaveBeenCalledOnce()
		})

		it('should allow single interceptor function and convert it to an array', async () => {
			const interceptor = vi.fn()
			const mockedFetch = getMockedFetch(true, 200, undefined, [
				interceptor,
			])
			const promise = fetch.get(product1Url, {
				fetchFunc: mockedFetch,
				interceptors: { request: interceptor },
			})
			await vi.runAllTimersAsync()
			await expect(promise).resolves.toEqual([interceptor])
			expect(interceptor).toHaveBeenCalledOnce()
			expect(mockedFetch).toHaveBeenCalledOnce()
		})

		it('should receive correct request, result & response interceptor arguments', async () => {
			const receivedArgs = {
				request: [] as unknown[],
				result: [] as unknown[],
				response: [] as unknown[],
			}
			const mockedInterceptors = {
				request: [
					(...args) => {
						receivedArgs.request = args
					},
				] as FetchInterceptorRequest[],
				result: [
					(...args) => {
						receivedArgs.result = args
					},
				] as FetchInterceptorResult[],
				response: [
					(...args) => {
						receivedArgs.response = args
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
			expect(receivedArgs.request).toEqual(expectedArgs)
			expect(receivedArgs.result).toEqual([mockedResult, ...expectedArgs])
			expect(receivedArgs.response[0]).toEqual({
				ok: true,
				status: 200,
				json: expect.any(Function),
			})
			expect(receivedArgs.response.slice(1)).toEqual(expectedArgs)
		})

		it('should receive correct error interceptor arguments', async () => {
			let receivedArgs = [] as unknown[]
			const mockedInterceptors = {
				error: [
					(error, url, options) => {
						receivedArgs = [error, url, objSort(options)]
					},
				] as FetchInterceptorError[],
				request: [],
				response: [],
				result: [],
			}
			const options = {
				interceptors: mockedInterceptors,
				validateUrl: true,
			} as Omit<FetchOptions, 'method'>
			const expectedOptions = getMockedResult('get', 1, options).args[1] // to prepare expected options
			expectedOptions.headers = new Headers()
			const url = 'an invalid url'
			await fetch.get(url, options).catch(noop)
			const [err, receivedUrl, receivedOptions] = receivedArgs as [
				FetchError,
				string,
				FetchOptions,
			]
			expect(err).toBeInstanceOf(FetchError)
			expect(receivedUrl).toBe(url)
			expect(receivedOptions).toEqual(expectedOptions)
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

	describe('onDownloadProgress', () => {
		const createStreamResponse = (
			content: string | Uint8Array,
			contentType: string,
			includeContentLength = true,
		) => {
			const uint8 =
				typeof content === 'string'
					? new TextEncoder().encode(content)
					: content
			const stream = new ReadableStream({
				start(controller) {
					// Split into two chunks to ensure progress is reported multiple times
					const half = Math.floor(uint8.length / 2)
					controller.enqueue(uint8.slice(0, half))
					controller.enqueue(uint8.slice(half))
					controller.close()
				},
			})
			const headers: Record<string, string> = {
				'Content-Type': contentType,
			}
			if (includeContentLength)
				headers['Content-Length'] = uint8.length.toString()

			return new Response(stream, { headers })
		}

		it('should report progress and return JSON', async () => {
			const onDownloadProgress = vi.fn()
			const data = { hello: 'world' }
			const content = JSON.stringify(data)
			const fetchFunc = vi.fn(() =>
				Promise.resolve(
					createStreamResponse(content, 'application/json'),
				),
			)

			const result = await fetch.get(product1Url, {
				fetchFunc,
				onDownloadProgress,
			})

			expect(result).toEqual(data)
			expect(onDownloadProgress).toHaveBeenCalled()
			const lastCall = onDownloadProgress.mock.calls.at(-1)!
			expect(lastCall).toEqual([100, content.length, content.length])
		})

		it('should report progress and return Text', async () => {
			const onDownloadProgress = vi.fn()
			const text = 'some text content'
			const fetchFunc = vi.fn(() =>
				Promise.resolve(createStreamResponse(text, 'text/plain')),
			)

			const result = await fetch.get(product1Url, {
				as: FetchAs.text,
				fetchFunc,
				onDownloadProgress,
			})

			expect(result).toBe(text)
			expect(onDownloadProgress).toHaveBeenCalled()
		})

		it('should report progress and return Blob', async () => {
			const onDownloadProgress = vi.fn()
			const text = 'blob data'
			const fetchFunc = vi.fn(() =>
				Promise.resolve(
					createStreamResponse(text, 'application/octet-stream'),
				),
			)

			const result = await fetch.get(product1Url, {
				as: FetchAs.blob,
				fetchFunc,
				onDownloadProgress,
			})

			expect(result).toBeInstanceOf(Blob)
			expect(await (result as Blob).text()).toBe(text)
		})

		it('should report progress and return ArrayBuffer', async () => {
			const onDownloadProgress = vi.fn()
			const text = 'buffer'
			const fetchFunc = vi.fn(() =>
				Promise.resolve(
					createStreamResponse(text, 'application/octet-stream'),
				),
			)

			const result = await fetch.get(product1Url, {
				as: FetchAs.arrayBuffer,
				fetchFunc,
				onDownloadProgress,
			})

			expect(result).toBeInstanceOf(ArrayBuffer)
			expect(new TextDecoder().decode(result as ArrayBuffer)).toBe(text)
		})

		it('should report progress and return bytes (Uint8Array)', async () => {
			const onDownloadProgress = vi.fn()
			const text = 'bytes'
			const fetchFunc = vi.fn(() =>
				Promise.resolve(
					createStreamResponse(text, 'application/octet-stream'),
				),
			)

			const result = await fetch.get(product1Url, {
				as: FetchAs.bytes,
				fetchFunc,
				onDownloadProgress,
			})

			expect(result).toBeInstanceOf(Uint8Array)
			expect(new TextDecoder().decode(result as Uint8Array)).toBe(text)
		})

		it('should report progress and return FormData', async () => {
			const onDownloadProgress = vi.fn()
			const formDataText = 'key=value'
			const fetchFunc = vi.fn(() =>
				Promise.resolve(
					createStreamResponse(
						formDataText,
						'application/x-www-form-urlencoded',
					),
				),
			)

			const result = await fetch.get(product1Url, {
				as: FetchAs.formData,
				fetchFunc,
				onDownloadProgress,
			})

			expect(result).toBeInstanceOf(FormData)
			expect((result as FormData).get('key')).toBe('value')
		})

		it('should return FormData when body contains "=" even if Content-Type is not form-urlencoded', async () => {
			const onDownloadProgress = vi.fn()
			const formDataText = 'name=John&age=30'
			const fetchFunc = vi.fn(() =>
				Promise.resolve(
					createStreamResponse(formDataText, 'text/plain'),
				),
			)

			const result = await fetch.get(product1Url, {
				as: FetchAs.formData,
				fetchFunc,
				onDownloadProgress,
			})

			expect(result).toBeInstanceOf(FormData)
			expect((result as FormData).get('name')).toBe('John')
			expect((result as FormData).get('age')).toBe('30')
		})

		it('should return FormData with "file" key as fallback when no "=" and not form-urlencoded', async () => {
			const onDownloadProgress = vi.fn()
			const text = 'plain text content without equals'
			const fetchFunc = vi.fn(() =>
				Promise.resolve(createStreamResponse(text, 'text/plain')),
			)

			const result = await fetch.get(product1Url, {
				as: FetchAs.formData,
				fetchFunc,
				onDownloadProgress,
			})

			expect(result).toBeInstanceOf(FormData)
			const file = (result as FormData).get('file') as Blob
			expect(file).toBeInstanceOf(Blob)
			expect(await file.text()).toBe(text)
		})

		it('should handle missing Content-Length (total = null)', async () => {
			const onDownloadProgress = vi.fn()
			const data = { a: 1 }
			const fetchFunc = vi.fn(() =>
				Promise.resolve(
					createStreamResponse(
						JSON.stringify(data),
						'application/json',
						false,
					),
				),
			)

			await fetch.get(product1Url, {
				as: FetchAs.json,
				fetchFunc,
				onDownloadProgress,
			})

			expect(onDownloadProgress).toHaveBeenCalled()
			const firstCall = onDownloadProgress.mock.calls[0]
			expect(firstCall[0]).toBe(null) // percent
			expect(firstCall[2]).toBe(null) // total
		})
	})

	describe('retry', () => {
		it('should fail fetch with 500 with exponential retry', async () => {
			const retry = 3
			const fetch500 = getMockedFetch(false, 500, 'Internal Server Error')
			let error: FetchError | undefined
			const promise = fetch
				.get(product1Url, {
					fetchFunc: fetch500,
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
			const mockedFetch = getMockedFetch(
				true,
				200,
				undefined,
				() => userCount,
			)
			const fetchFunc = () => {
				++userCount
				return mockedFetch('')
			}

			const promise = fetch.get(product1Url, {
				fetchFunc,
				retry: 5,
				retryIf: (_, attemptCount) => attemptCount < 3, // wait until user count is 3,
			})
			await vi.runAllTimersAsync()

			const result = await promise
			expect(result).toBe(3)
			expect(result).toBe(userCount)
			expect(mockedFetch).toHaveBeenCalledTimes(3)
		})

		it('should handle fetch fail due to network issues with linear retry', async () => {
			const fetchFunc = getMockedFetch(false, 0, '', 'Failed to fetch')
			const onError = vi.fn()
			const promise = fetch
				.get(product1Url, {
					fetchFunc,
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
			expect(fetchFunc).toHaveBeenCalled()
			expect(fetchFunc).toHaveBeenCalledTimes(4) // 3 retries + first call
		})

		it('should avoid retrying after being aborted', async () => {
			const handleErr = vi.fn()
			const abortCtrl = new AbortController()
			const promise = fetch('', { abortCtrl, retry: 5 }).catch(handleErr)
			abortCtrl.abort()
			await vi.runAllTimersAsync()
			await promise
			expect(handleErr).toHaveBeenCalledWith(expect.any(Error))
		})
	})

	describe('timeout & abort', () => {
		it('should reject after timeout', async () => {
			mockedFetch = vi.fn(async (url, { timeout }) => {
				const abortError = new Error('The user aborted a request.')
				abortError.name = 'AbortError'
				return PromisE.delayReject(timeout, abortError)
			})
			const promise = fetch.get(product1Url, {
				fetchFunc: mockedFetch,
				timeout: -1, // test invalid value => falls back to default
			})
			promise.catch(noop) // avoid unhandled rejection
			await vi.advanceTimersByTimeAsync(fetch.defaults.timeout)
			expect(mockedFetch).toHaveBeenCalled()
			await expect(promise).rejects.toEqual(expect.any(FetchError))
		})

		it('should abort the fetch request when promise is resolved before finalization', async () => {
			const mockedFetch = vi.fn(() => PromisE.delay(10_000))
			fetch.defaults.fetchFunc = mockedFetch as any
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
			mockedFetch = vi.fn(() => PromisE.delay(10_000))
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

		it('should invoke onAbort callback', async () => {
			const onAbort = vi.fn(() => new Error('Aborted'))
			const onTimeout = vi.fn()
			const abortCtrl = new AbortController()
			const promise = fetch.get(product1Url, {
				abortCtrl,
				onAbort,
				onTimeout,
				timeout: 5000,
			})
			abortCtrl.abort()
			let error: FetchError | undefined
			promise.catch(err => (error = err))
			await vi.runAllTimersAsync()
			expect(error).instanceOf(FetchError)
			expect(error?.message).toBe('Aborted')
			expect(onAbort).toHaveBeenCalled()
		})
	})
})
