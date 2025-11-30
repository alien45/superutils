import { objSort } from '@superutils/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import fetch, {
	config,
	type FetchArgs,
	fetchDeferred,
	type FetchDeferredArgs,
	mergeFetchOptions,
} from '../src'
import { getDeferredContext } from '@superutils/promise/tests/deferred.test'

describe('deferredFetch', () => {
	let mockFetch200: ReturnType<typeof vi.fn>
	const fetchBaseUrl = 'https://dummyjson.com/products'
	const getExpectedFetchResult = (
		productId: number,
		options: FetchDeferredArgs[1] = {},
		success = true,
	) => ({
		success,
		args: [
			`${fetchBaseUrl}/${productId}`,
			objSort(
				mergeFetchOptions(
					{
						abortCtrl: expect.any(AbortController),
						method: 'get',
						signal: expect.any(AbortSignal),
					},
					options,
				),
			),
		],
	})

	const mockFetch =
		(status = 200, ok = status >= 200 && status < 300) =>
		(...[url, options = {}]: FetchArgs) =>
			!ok
				? Promise.reject(`Request failed with status code ${status}.`)
				: Promise.resolve({
						ok,
						status,
						json: () =>
							Promise.resolve({
								success: ok,
								args: [url, objSort(options)], // sort for consistency,
							}),
					})

	beforeEach(() => {
		mockFetch200 = vi.fn(mockFetch(200))
		vi.stubGlobal('fetch', mockFetch200)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.unstubAllGlobals()

		vi.useRealTimers()
	})

	it('should debounce fetch calls and only execute trailing calls', async () => {
		// This test will now use the mocked fetch.
		// - Default fetch url is set to `${productsBaseUrl}/1`
		// - 3 calls are made within 100ms.
		// - 1st is called using default url. 2nd & 3rd are called by overriding default URL.
		// - The first 2 are ignored. The 3rd is queued.
		// - runAllTimersAsync executes only the 3rd call.
		const context = getDeferredContext()
		const headers = new Headers({ 'x-header': 'default header' })
		const getProduct = fetch.get.deferred(
			context,
			`${fetchBaseUrl}/1`, // default url
			{ headers },
		)
		getProduct()
		await vi.runAllTimersAsync()
		getProduct(`${fetchBaseUrl}/2`)
		const last = getProduct(`${fetchBaseUrl}/3`, {
			timeout: 5000,
			abortCtrl: new AbortController(),
		})
		await vi.runAllTimersAsync() // Executes the last call
		expect(mockFetch200).toHaveBeenCalledTimes(2) // only the last call is executed
		expect(context.data.results).toHaveLength(2)
		expect(context.data.ignored).toHaveLength(1) // First two calls are ignored
		expect(context.data.errors).toHaveLength(0)
		const firstResult = getExpectedFetchResult(1, { headers }, true)
		const lastResult = getExpectedFetchResult(3, { headers, timeout: 5000 })
		expect(context.data.results).toEqual([firstResult, lastResult])
		await expect(last).resolves.toEqual(lastResult)
	})

	it('should merge headers', async () => {
		const context = getDeferredContext()
		const globalHeadersOrg = config.fetchOptions.headers
		const globalHeaders = new Headers([['x-header', 'global header']])
		const commonHeaders = { 'y-header': 'common header' }
		const localHeaders = { 'z-header': 'local header' }
		config.fetchOptions.headers = globalHeaders
		const getProduct = fetchDeferred(
			context,
			`${fetchBaseUrl}/1`, // default url
			{ headers: commonHeaders },
		)
		const promise = getProduct(undefined, { headers: localHeaders })
		await vi.runAllTimersAsync() // Executes the last call
		const result = await promise
		const expResult = getExpectedFetchResult(1, {
			headers: new Headers({ ...commonHeaders, ...localHeaders }),
		})
		expect(mockFetch200).toHaveBeenCalledTimes(1)
		expect(context.data.results).toEqual([expResult])
		// set original headers back
		config.fetchOptions.headers = globalHeadersOrg
	})
})
