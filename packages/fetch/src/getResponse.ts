import { fallbackIfFails, isPositiveInteger } from '@superutils/core'
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
export const getResponse = async (
	url: FetchArgs[0],
	options: FetchArgs[1] = {},
) => {
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
			retryIf: async (res, count, error) => {
				const failed = !!error || !res?.ok

				return !!(
					(await fallbackIfFails(
						options?.retryIf ?? failed,
						[res, count, error],
						failed,
					)) ?? failed
				)
			},
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
