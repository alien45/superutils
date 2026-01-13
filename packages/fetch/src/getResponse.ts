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
	const fetchFunc = globalThis.fetch
	if (!isPositiveInteger(options.retry))
		return fetchFunc(url, options as RequestInit)

	let attemptCount = 0
	const response = PromisE.retry(
		() => {
			attemptCount++
			return fetchFunc(url, options as RequestInit)
		},
		{
			...options,
			retryIf: async (res, count) =>
				res?.ok === false
				|| (await options?.retryIf?.(res, count)) === true,
		},
	).catch(err =>
		Promise.reject(
			new Error(`Request failed after attempt #${attemptCount}`, {
				cause: err,
			}),
		),
	)

	return response
}
export default getResponse
