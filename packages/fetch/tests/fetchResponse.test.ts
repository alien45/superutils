import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import fetch, { fetchResponse } from '../src'

describe('fetchResponse', () => {
	const fetchBaseUrl = 'https://dummyjson.com/products' // dummy URL -> not called
	let mockedFetch
	const okResponse = {
		ok: true,
		status: 200,
		json: () => Promise.resolve(),
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
		const promise = fetchResponse<Response>(fetchBaseUrl)
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

	it('should set new default options and sync with fetch.defaults', () => {
		const defualts = fetchResponse.defaults
		fetchResponse.defaults = { timeout: 0 } as any
		expect(fetch.defaults).toEqual({ timeout: 0 })

		fetchResponse.defaults = defualts
		expect(fetch.defaults).toEqual(defualts)
	})
})
