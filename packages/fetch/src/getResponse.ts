import PromisE from '@superutils/promise'
import { FetchArgs } from './types'
import { isPositiveInteger } from '@superutils/core'

/**
 * Execute built-in `fetch()` and retry if request fails and `options.retry > 0`.
 *
 * @param url request URL
 * @param options (optional)
 *
 * @returns response
 */
export const getResponse = async (...[url, options = {}]: FetchArgs) => {
	let attemptCount = 0 // preserve the number of attempts made
	const doFetch = async () => {
		attemptCount++

		return globalThis.fetch(url, options).catch((err: Error) =>
			err.message === 'Failed to fetch'
				? // catch network errors to allow retries
					new Response(null, {
						status: 0,
						statusText: 'Network Error',
					})
				: Promise.reject(err),
		)
	}

	if (!isPositiveInteger(options.retry)) return doFetch()

	const response = PromisE.retry(doFetch, {
		...options,
		retryIf: async (res, count, err) =>
			res?.ok === false
			|| (await options?.retryIf?.(res, count, err)) === true,
	}).catch(err =>
		Promise.reject(
			new Error(`Request failed after attempt #${attemptCount}`, {
				cause: err,
			}),
		),
	)

	return response
}
export default getResponse
