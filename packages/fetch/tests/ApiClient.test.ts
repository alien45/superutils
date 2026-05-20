import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiClient } from '../src/ApiClient'
import fetch from '../src/fetch'
import { GET_METHODS, POST_METHODS } from '../src/types'
import { getMockedFetch } from './utils'

describe('ApiClient', () => {
	const baseUrl = 'https://api.example.com/'

	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.unstubAllGlobals()
		fetch.defaults.fetchFunc = undefined
	})

	it('should initialize with default values and defined methods', () => {
		const api = new ApiClient()
		expect(api.get).toBeDefined()
		expect(api.post).toBeDefined()
		expect(api.put).toBeDefined()
		expect(api.patch).toBeDefined()
		expect(api.delete).toBeDefined()
		expect(api.head).toBeDefined()
		expect(api.options).toBeDefined()
		expect(api.client).toBeDefined()
		expect(api.postClient).toBeDefined()

		expect((api.get.deferred as any).test).toBeUndefined()
		expect((api.post as any).test).toBeUndefined()
	})

	it('should have non-enumerable and non-writable properties for methods', () => {
		const api = new ApiClient()
		const methodDescriptors = [...GET_METHODS, ...POST_METHODS].map(m =>
			Object.getOwnPropertyDescriptor(api, m.toLowerCase()),
		)
		for (const descriptor of methodDescriptors) {
			expect(descriptor?.enumerable).toBe(false)
			expect(descriptor?.writable).toBe(false)
			expect(descriptor?.value).toBeInstanceOf(Function)
			expect(descriptor?.value.deferred).toBeInstanceOf(Function)
		}
	})

	it('should handle apiBaseUrl interceptor correctly with string URLs', async () => {
		const mockedFetch = getMockedFetch()
		const api = new ApiClient(baseUrl, {
			commonOptions: { fetchFunc: mockedFetch },
		})

		// Relative path
		await api.get('users')
		expect(mockedFetch).toHaveBeenCalledWith(
			`${baseUrl}users`,
			expect.any(Object),
		)

		// Absolute path (http)
		await api.get('http://google.com')
		expect(mockedFetch).toHaveBeenCalledWith(
			'http://google.com',
			expect.any(Object),
		)

		// Absolute path (https)
		await api.get('https://google.com')
		expect(mockedFetch).toHaveBeenCalledWith(
			'https://google.com',
			expect.any(Object),
		)

		// Path starting with base URL
		await api.get(`${baseUrl}profile`)
		expect(mockedFetch).toHaveBeenCalledWith(
			`${baseUrl}profile`,
			expect.any(Object),
		)
	})

	it('should not modify URLs if apiBaseUrl is not provided', async () => {
		const mockedFetch = getMockedFetch()
		const api = new ApiClient(undefined, {
			commonOptions: { fetchFunc: mockedFetch },
		})

		await api.get('users')
		expect(mockedFetch).toHaveBeenCalledWith('users', expect.any(Object))
	})

	it('should not modify non-string URLs (e.g. URL object)', async () => {
		const mockedFetch = getMockedFetch()
		const api = new ApiClient(baseUrl, {
			commonOptions: { fetchFunc: mockedFetch },
		})

		const urlObj = new URL('https://other.com/api')
		await api.get(urlObj)
		expect(mockedFetch).toHaveBeenCalledWith(urlObj, expect.any(Object))
	})

	it('should apply errorPrefix to error messages correctly', async () => {
		const errorPrefix = '[TEST-API]'
		const errorMsg = 'Original Error'
		const mockedFetch = vi.fn(() =>
			Promise.resolve({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
				json: () => Promise.resolve(errorMsg),
				clone: function () {
					return this
				},
			} as any),
		)

		const api = new ApiClient(undefined, {
			errorPrefix,
			commonOptions: { fetchFunc: mockedFetch },
		})

		await expect(api.get('/test')).rejects.toThrow(
			`${errorPrefix} ${errorMsg}`,
		)
	})

	it('should respect the precedence hierarchy (fixed > call > common)', async () => {
		const mockedFetch = getMockedFetch()
		const api = new ApiClient(undefined, {
			fixedOptions: {
				headers: { 'X-Fixed': 'fixed-val' },
				timeout: 5000,
			},
			commonOptions: {
				headers: { 'X-Common': 'common-val' },
				timeout: 1000 as any,
				fetchFunc: mockedFetch,
			},
		})

		// Call options should override common, but not fixed
		await api.get('/test', {
			headers: { 'X-Call': 'call-val', 'X-Fixed': 'overridden-by-fixed' },
			timeout: 2000 as any, // Cast needed here as FixedOptions forbids override in CommonOptions type
		})

		const options = mockedFetch.mock.calls[0][1] as any
		const headers = options.headers

		expect(headers.get('X-Fixed')).toBe('fixed-val') // Fixed wins
		expect(headers.get('X-Common')).toBe('common-val') // Common preserved
		expect(headers.get('X-Call')).toBe('call-val') // Call preserved
		expect(options.timeout).toBe(5000) // Fixed wins over call (2000) and common (1000)
	})

	it('should set ignoreGlobalDefaults to true by default', async () => {
		const mockedFetch = getMockedFetch()
		const api = new ApiClient(undefined, {
			commonOptions: { fetchFunc: mockedFetch },
		})

		await api.get('/test')
		const options = mockedFetch.mock.calls[0][1] as any
		expect(options.ignoreGlobalDefaults).toBe(true)
	})

	it('should handle commonDeferOptions for deferred calls', async () => {
		const mockedFetch = getMockedFetch()
		const onResult = vi.fn()
		const api = new ApiClient(undefined, {
			commonOptions: { fetchFunc: mockedFetch },
			commonDeferOptions: { delay: 150, onResult },
		})

		const deferred = api.get.deferred()
		deferred('/test')

		await vi.advanceTimersByTimeAsync(150)
		expect(mockedFetch).toHaveBeenCalledOnce()
		expect(onResult).toHaveBeenCalled()
	})

	it('should verify method aliases use correct HTTP methods and base clients', async () => {
		const mockedFetch = getMockedFetch()
		const api = new ApiClient(baseUrl, {
			commonOptions: { fetchFunc: mockedFetch },
		})

		const methodsToTest = [
			{ call: () => api.get('/t'), method: 'GET' },
			{ call: () => api.post('/t', { data: 1 }), method: 'POST' },
			{ call: () => api.put('/t', { data: 1 }), method: 'PUT' },
			{ call: () => api.patch('/t', { data: 1 }), method: 'PATCH' },
			{ call: () => api.delete('/t'), method: 'DELETE' },
			{ call: () => api.head('/t'), method: 'HEAD' },
			{ call: () => api.options('/t'), method: 'OPTIONS' },
		]

		for (const { call, method } of methodsToTest) {
			await call()
			const options = mockedFetch.mock.calls.at(-1)![1] as any
			expect(options.method).toBe(method)
		}

		// Base clients
		await api.client('/t')
		expect((mockedFetch.mock.calls.at(-1)![1] as any).method).toBe('GET') // default for createClient

		await api.postClient('/t', { data: 1 })
		expect((mockedFetch.mock.calls.at(-1)![1] as any).method).toBe('POST') // default for createPostClient
	})
})
