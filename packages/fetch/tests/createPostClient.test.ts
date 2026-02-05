import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPostClient, FetchArgs, FetchAs, PostOptions } from '../src'
import { productsBaseUrl } from './utils'

describe('createClient', () => {
	type ResultType = { success: boolean; args: [string | URL, PostOptions] }
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
		const promise = client<ResultType>(productsBaseUrl + '/1', {
			method: 'PUT' as any, // this should be ignored
			headers: {
				'x-custom-header': 'custom-value',
			},
		})
		await vi.runAllTimersAsync()
		const {
			args: [url, options],
		} = await promise
		expect(url).toBe(productsBaseUrl + '/1')
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
			productsBaseUrl + '/1',
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
		expect(url).toBe(productsBaseUrl + '/1')
		expect(options.method).toBe('post')
	})
})
