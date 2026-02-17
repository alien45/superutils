import { isStr, objSort } from '@superutils/core'
import { expect } from 'vitest'
import fetch, { ContentType, FetchAs, FetchOptions, mergeOptions } from '../src'

export const productsBaseUrl = 'https://dummyjson.com/products'

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
) => ({
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
				...options,
				headers: (() => {
					const headers = new Headers(options?.headers)
					if (['delete', 'patch', 'post', 'put'].includes(method))
						!headers.get('content-type')
							&& headers.set(
								'content-type',
								ContentType.APPLICATION_JSON,
							)
					return headers
				})(),
				...(['delete', 'patch', 'post', 'put'].includes(
					String(method).toLowerCase(),
				)
					&& options.body !== undefined && {
						body: isStr(options.body)
							? options.body
							: JSON.stringify(options.body),
					}),
			}),
		),
	] as [string, FetchOptions],
})
