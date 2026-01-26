import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createClient, FetchArgs, FetchAs, FetchOptions } from '../src'
import { productsBaseUrl } from './utils'

describe('createClient', () => {
	type ResultType = { success: boolean; args: [string | URL, FetchOptions] }
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

	it('should create a new fetch client with shared options', async () => {
		const client = createClient(
			{
				as: FetchAs.json,
				method: 'GET',
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
		expect(options.method).toBe('GET')

		const deferredClient = client.deferred({})
		deferredClient().then(console.log, console.error)
	})
})
