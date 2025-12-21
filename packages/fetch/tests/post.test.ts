import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import fetch, { FetchAs } from '../src'

describe('post', () => {
	const postUrl = 'https://dummyjson.com/products/add'
	afterEach(() => {
		vi.useRealTimers()
		vi.unstubAllGlobals()
	})

	beforeEach(() => {
		vi.useFakeTimers()
	})

	it('should return successful response parsed as JSON by default', async () => {
		const newUser = {
			age: 33,
			id: 'adam',
			location: 'heaven',
			name: 'Adam',
		}
		const post201 = vi.fn((...args: any[]) =>
			Promise.resolve({
				ok: true,
				status: 201,
				json: async () => newUser,
			}),
		)
		vi.stubGlobal('fetch', post201)
		const promise = fetch.post(postUrl, () => newUser)
		await vi.runAllTimersAsync()
		await expect(promise).resolves.toEqual(newUser)
		expect(post201).toHaveBeenCalledOnce()
	})

	it('should return response without parsing', async () => {
		const post201 = vi.fn((...[_url, body]: any[]) =>
			Promise.resolve(new Response(body)),
		)
		vi.stubGlobal('fetch', post201)
		const promise = fetch.post(postUrl, 'body', { as: FetchAs.response })
		await vi.runAllTimersAsync()
		const response = await promise
		expect(response).instanceOf(Response)
		await expect(response.status).toBe(200)
		expect(post201).toHaveBeenCalledOnce()
	})
})
