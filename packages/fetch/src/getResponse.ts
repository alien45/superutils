import PromisE from '@superutils/promise'
import { FetchArgs } from './types'

/**
 * Execute built-in `fetch()` and retry if request fails and `options.retry > 0`.
 *
 * @param url request URL
 * @param options (optional)
 *
 * @returns response
 */
export const getResponse = async (...[url, options]: FetchArgs) => {
	const doFetch = () =>
		globalThis.fetch(url, options).catch((err: Error) =>
			err.message === 'Failed to fetch'
				? // catch network errors to allow retries
					new Response(null, {
						status: 0,
						statusText: 'Network Error',
					})
				: globalThis.Promise.reject(err),
		)

	const response = await PromisE.retry(doFetch, {
		...options,
		retryIf: (res, count) =>
			!res?.ok && options?.retryIf?.(res, count) !== false,
	}).catch(err => {
		if (!options?.retry) return Promise.reject(err as Error)
		const msg = `Request failed after attempt #${(options.retry || 0) + 1}`
		return Promise.reject(new Error(msg, { cause: err }))
	})
	return response
}
export default getResponse
