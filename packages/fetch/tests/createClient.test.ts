import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	createClient,
	FetchArgs,
	FetchAs,
	FetchError,
	FetchOptions,
} from '../src'
import getClientDeferredSimulator from './client-deferred-simulator'
import { productsBaseUrl } from './utils'

describe('createClient', () => {
	const product1Url = productsBaseUrl + '/1'
	type ResultType = { success: boolean; args: [string | URL, FetchOptions] }
	const simulateClientCalls = getClientDeferredSimulator(false)
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
			{ as: FetchAs.json, method: 'GET' },
			{ method: 'POST' as any }, // this should be ignored
		)
		const promise = client<ResultType>(product1Url, {
			method: 'PUT' as any, // this should be ignored
			headers: { 'x-custom-header': 'custom-value' },
		})
		await vi.runAllTimersAsync()
		const {
			args: [url, options],
		} = await promise
		expect(url).toBe(product1Url)
		expect(options.method).toBe('GET')

		// test the deferred variant
		const deferredClient = client.deferred({})
		const promiseDC = deferredClient<ResultType>(product1Url, {
			method: 'PUT' as any, // this should be ignored
			headers: { 'x-custom-header': 'custom-value' },
		})
		await vi.runAllTimersAsync()
		const {
			args: [url2, options2],
		} = await promiseDC
		expect(url2).toBe(product1Url)
		expect(options2.method).toBe('GET')
	})

	it('should abort on early finalize', async () => {
		const client = createClient()
		const abortCtrl = new AbortController()
		const promise = client(product1Url, { abortCtrl })
		promise.resolve(0) // resolve the promise externally (early finalize)
		await vi.runAllTimersAsync()
		await promise
		await expect(promise).resolves.toBe(0)
		expect(abortCtrl.signal.aborted).toBe(true)
		expect(promise.aborted).toBe(false) // only true when promsie was rejected because of abort
	})

	it('should allow setting delay', async () => {
		const client1 = createClient({}, {}, { delay: 99 })
		const deferredClient1 = client1.deferred({ delay: 99 }, '')

		const client2 = createClient({}, {}, { delay: undefined })
		const deferredClient2 = client2.deferred({ delay: 99 })

		const client3 = createClient({}, {}, { delay: 0 })
		const deferredClient3 = client3.deferred({ delay: 99 })

		const client4 = createClient({}, {}, { delay: 99 })
		const deferredClient4 = client4.deferred({ delay: undefined })
	})

	it('should correctly handle `debounce+leading` fetch calls', async () => {
		await simulateClientCalls({
			throttle: false,
			leading: true,
		})
	})

	it('should correctly handle `debounce-leading` fetch calls', async () => {
		await simulateClientCalls({ throttle: false, leading: false })
	})

	it('should correctly handle `throttle+trailing` fetch calls', async () => {
		await simulateClientCalls({ throttle: true, trailing: true })
	})

	it('should correctly handle `throttle-trailing` fetch calls', async () => {
		await simulateClientCalls({ throttle: true, trailing: false })
	})
})
