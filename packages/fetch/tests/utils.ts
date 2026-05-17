import { expect, vi } from 'vitest'
import { isFn, isStr, objSort } from '../../core/src'
import fetch, {
	ContentType,
	FetchArgs,
	FetchAs,
	FetchFunc,
	FetchOptions,
	mergeOptions,
} from '../src'

export const productsBaseUrl = 'https://dummyjson.com/products'

export const getMockedFetch = (
	success = true,
	status = 200,
	/**
	 * If provided, will throw error with this.
	 * - `success = false`: will throw error immediately, mimicking fetch failed error
	 * - `success = true`: will throw error when invoking `.json()`
	 */
	error?: string,
	result?: unknown,
) => {
	const mock = vi.fn((...args: FetchArgs) =>
		!success
			? Promise.reject(new Error(error || 'Failed to fetch'))
			: Promise.resolve({
					ok: success,
					status,
					json: () =>
						error
							? Promise.reject(new Error(error))
							: Promise.resolve(
									(isFn(result) ? result() : result) ?? {
										args,
										success,
									},
								),
				}),
	)

	return mock as FetchFunc & typeof mock
}

/**
 * Generate mocked result for fetch calls.
 *
 * @returns mocked result object:
 * ```typescript
 * {
 *   success: boolean,
 *   args: [url: string, options: FetchOptions]
 * }
 * ```
 */
export const getMockedResult = (
	method = 'get',
	productId: number,
	options: FetchOptions = {},
	success = true,
) => {
	method = method.toUpperCase()
	const isPostLike = postMethods.includes(method)
	return {
		success,
		args: [
			`${productsBaseUrl}/${productId}`,
			objSort(
				mergeOptions(fetch.defaults, {
					abortCtrl: expect.any(AbortController),
					as: FetchAs.json,
					batchFunc: 'all' as any,
					method,
					onAbort: expect.any(Function),
					onTimeout: expect.any(Function),
					signal: expect.any(AbortSignal),
					ignoreGlobalDefaults: false,
					...options,
					headers: (() => {
						const headers = new Headers(options?.headers)
						if (isPostLike)
							!headers.get('content-type')
								&& headers.set(
									'content-type',
									ContentType.APPLICATION_JSON,
								)
						return headers
					})(),
					...(isPostLike
						&& options.body !== undefined && {
							body: isStr(options.body)
								? options.body
								: JSON.stringify(options.body),
						}),
				}),
			),
		] as [string, FetchOptions],
	}
}
const postMethods = ['DELETE', 'PATCH', 'POST', 'PUT']
