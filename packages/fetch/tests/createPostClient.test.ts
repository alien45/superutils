import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPostClient, FetchArgs, FetchAs, PostOptions } from '../src'
import getClientDeferredSimulator from './client-deferred-simulator'
import { productsBaseUrl } from './utils'

describe('createClient', () => {
	const product1Url = productsBaseUrl + '/1'
	type ResultType = { success: boolean; args: [string | URL, PostOptions] }
	const simulateClientCalls = getClientDeferredSimulator(true)
	afterEach(() => {
		// Setup global fetch mock
		vi.unstubAllGlobals()
		vi.useRealTimers()
	})

	beforeEach(() => {
		const mockedFetch = vi.fn((...args: FetchArgs) =>
			Promise.resolve({
				ok: true,
				status: 200,
				json: async () => ({ success: true, args }),
			} as unknown as Response),
		)
		vi.stubGlobal('fetch', mockedFetch)
		vi.useFakeTimers()
	})

	it('should create a new post client with shared options', async () => {
		const client = createPostClient(
			{
				as: FetchAs.json,
				method: 'patch',
			},
			{
				method: 'POST' as any, // this should be ignored
			},
		)
		const promise = client<ResultType>(product1Url, {
			method: 'PUT' as any, // this should be ignored
			headers: {
				'x-custom-header': 'custom-value',
			},
		})
		await vi.runAllTimersAsync()
		const {
			args: [url, options],
		} = await promise
		expect(url).toBe(product1Url)
		expect(options.method).toBe('patch')
	})

	it('should create a new deferred post client', async () => {
		const client = createPostClient({
			as: FetchAs.json,
			method: 'post',
		})
		const deferredClient = client.deferred(
			{
				delayMs: 99,
			},
			product1Url,
			undefined,
			{ method: 'patch' as any },
		)
		const promise = deferredClient<ResultType>(undefined, {
			body: { data: 'test' },
		})
		await vi.runAllTimersAsync()
		const {
			args: [url, options],
		} = await promise
		expect(url).toBe(product1Url)
		expect(options.method).toBe('post')
	})

	it('should correctly handle `debounce+leading` post calls', async () => {
		await simulateClientCalls({ throttle: false, leading: true })
	})

	it('should correctly handle `debounce-leading` post calls', async () => {
		await simulateClientCalls({ throttle: false, leading: false })
	})

	it('should correctly handle `throttle+trailing` post calls', async () => {
		await simulateClientCalls({ throttle: true, trailing: true })
	})

	it('should correctly handle `throttle-trailing` post calls', async () => {
		await simulateClientCalls({ throttle: true, trailing: false })
	})
})
