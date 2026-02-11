import { fallbackIfFails, isPositiveInteger } from '@superutils/core'
import { retry } from '@superutils/promise'
import { FetchArgs, FetchFunc } from './types'

/**
 * Executes the built-in `fetch()` (or a custom `fetchFunc` if provided) with support for automatic retries.
 *
 * If `options.retry` is greater than 0, the request will be retried if it fails or if the response is not OK,
 * unless overridden by `options.retryIf`.
 *
 * @param url The request URL.
 * @param options (optional) Fetch options, including retry settings.
 *
 * @returns A promise resolving to the Response.
 */
export const getResponse = (url: FetchArgs[0], options: FetchArgs[1] = {}) => {
	const fetchFunc = options.fetchFunc ?? (globalThis.fetch as FetchFunc)
	if (!isPositiveInteger(options.retry)) return fetchFunc(url, options)

	let attemptCount = 0
	const response = retry(
		() => {
			attemptCount++
			return fetchFunc(url, options)
		},
		{
			...options,
			retryIf: async (res, count, error) => {
				const { abortCtrl, retryIf, signal } = options
				if (abortCtrl?.signal.aborted || signal?.aborted) return false

				return !!(
					(await fallbackIfFails(
						retryIf,
						[res, count, error],
						undefined,
					))
					?? (!!error || !res?.ok)
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
