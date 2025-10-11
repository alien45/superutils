import { isStr } from '@superutils/core'
import mergeFetchOptions from './mergeFetchOptions'
import { PostArgs } from './types'
import PromisE_fetch from './fetch'

/**
 * @name    PromisE.post
 * @summary make a HTTP 'POST' request and return result as JSON.
 * Default 'content-type' is 'application/json'.
 * Will reject promise if response status code is 2xx (200 <= status < 300).
 */
export default function PromisE_post<T = unknown>(
	...[url = '', data, options = {}]: PostArgs
) {
	return PromisE_fetch<T>(
		url,
		mergeFetchOptions(
			{
				method: 'post',
				body: isStr(data) ? data : JSON.stringify(data),
			},
			options,
		),
	)
}
