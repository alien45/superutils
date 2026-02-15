import { objSort } from '@superutils/core'
import { getDeferredContext } from '@superutils/promise/tests/getDeferredContext'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import fetch, { type FetchArgs } from '../src'
import { productsBaseUrl, getMockedResult } from './utils'

describe('fetch.get.deferred', () => {
	let mockFetch200: ReturnType<typeof vi.fn>
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
		mockFetch200.mockClear()
		vi.unstubAllGlobals()
		vi.useRealTimers()
	})

	it('should debounce fetch calls and only execute trailing calls', async () => {
		// This test will now use the mocked fetch.
		// - Default fetch url is set to `${productsBaseUrl}/1`
		// - 3 calls are made within 100ms.
		// - The first 2 are ignored. The 3rd is queued.
		// - runAllTimersAsync executes only the 3rd call.
		const context = getDeferredContext()
		const headers = new Headers({ 'x-header': 'default header' })
		const getProduct = fetch.get.deferred(
			context,
			undefined, // no default url
			{ headers },
		)
		getProduct(`${productsBaseUrl}/1`)
		await vi.runAllTimersAsync()
		getProduct(`${productsBaseUrl}/2`)
		const last = getProduct(`${productsBaseUrl}/3`, {
			timeout: 5000,
			abortCtrl: new AbortController(),
		})
		await vi.runAllTimersAsync() // Executes the last call
		expect(mockFetch200).toHaveBeenCalledTimes(2) // only the last call is executed
		expect(context.data.results).toHaveLength(2)
		expect(context.data.ignored).toHaveLength(1) // First two calls are ignored
		expect(context.data.errors).toHaveLength(0)
		const expected1stResult = getMockedResult('get', 1, { headers }, true)
		const expectedLastResult = getMockedResult('get', 3, {
			headers,
			timeout: 5000,
		})
		expect(context.data.results).toEqual([
			expected1stResult,
			expectedLastResult,
		])
		await expect(last).resolves.toEqual(expectedLastResult)
	})

	it('should merge headers', async () => {
		const context = getDeferredContext()
		const globalHeadersOrg = fetch.defaults.headers
		const globalHeaders = new Headers([['x-header', 'global header']])
		const commonHeaders = { 'y-header': 'common header' }
		const localHeaders = { 'z-header': 'local header' }
		fetch.defaults.headers = globalHeaders
		const getProduct = fetch.get.deferred(
			context,
			`${productsBaseUrl}/1`, // default url
			{ headers: commonHeaders },
		)
		const promise = getProduct({ headers: localHeaders })
		await vi.runAllTimersAsync() // Executes the last call
		const expResult = getMockedResult('get', 1, {
			headers: new Headers({ ...commonHeaders, ...localHeaders }),
		})
		await expect(promise).resolves.toEqual(expResult)
		expect(mockFetch200).toHaveBeenCalledTimes(1)
		expect(context.data.results).toEqual([expResult])
		// set original headers back
		fetch.defaults.headers = globalHeadersOrg
	})
})
