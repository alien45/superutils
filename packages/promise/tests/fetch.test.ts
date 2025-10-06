import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PromisE from '../src'

describe('fetch', () => {
	const fetchBaseUrl = 'https://dummyjson.com/products'

	beforeEach(() => {
		// Mock the global fetch to avoid real network requests
		vi.stubGlobal('fetch', vi.fn())
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('should throw error when invalid URL is provided', async () => {
		const promise = PromisE.fetch('invalid url')
		await expect(promise).rejects.toThrow('Invalid URL')
	})

	it('should fail fetch with 500', async () => {
		const fetch500 = vi.fn((...args: any[]) =>
			Promise.resolve({
				ok: false,
				status: 500,
				json: () =>
					Promise.resolve({
						success: false,
						message: 'Internal Server Error',
						args,
					}),
			}),
		)
		vi.stubGlobal('fetch', fetch500)
		const promise = PromisE.fetch(`${fetchBaseUrl}`)
		await expect(promise).rejects.toThrow('Internal Server Error')
	})

	it('should handle AbortError from fetch and throw "Request timed out"', async () => {
		const abortError = new Error('The user aborted a request.')
		abortError.name = 'AbortError'
		const fetchAbortedMock = vi.fn().mockRejectedValue(abortError)
		vi.stubGlobal('fetch', fetchAbortedMock)

		const promise = PromisE.fetch(`${fetchBaseUrl}`)
		await expect(promise).rejects.toThrow('Request timed out')
		expect(fetchAbortedMock).toHaveBeenCalled()
	})

	it('should handle fetch fail due to network issues', async () => {
		// Mock the global Response constructor to allow status 0, which modern fetch polyfills disallow.
		const OriginalResponse = global.Response
		vi.stubGlobal(
			'Response',
			vi.fn((body, init) => {
				if (init?.status === 0)
					return {
						ok: false,
						status: 0,
						json: () => Promise.resolve(),
					}
				return new OriginalResponse(body, init)
			}),
		)

		const fetchNetworkError = vi.fn(() =>
			Promise.reject(new Error('Failed to fetch')),
		)
		vi.stubGlobal('fetch', fetchNetworkError)

		const promise = PromisE.fetch(`${fetchBaseUrl}`)
		await expect(promise).rejects.toThrow(
			'Request failed with status code: 0.',
		)
		expect(fetchNetworkError).toHaveBeenCalled()

		global.Response = OriginalResponse
	})
})
