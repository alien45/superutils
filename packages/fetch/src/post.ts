import { isStr } from '@superutils/core'
import mergeFetchOptions from './mergeFetchOptions'
import { PostArgs } from './types'
import fetcher from './fetch'

/**
 * @summary	make a HTTP 'POST' request and return result as JSON.
 * Default 'content-type' is 'application/json'.
 * Will reject promise if response status code is 2xx (200 <= status < 300).
 */
export default function post<T = unknown>(
	...[url = '', data, options = {}]: PostArgs
) {
	return fetcher<T>(
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
