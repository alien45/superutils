import { isStr } from '@superutils/core'
import fetch from './fetch'
import mergeFetchOptions from './mergeFetchOptions'
import { PostArgs } from './types'

/**
 * A convenience wrapper around {@link fetch} for making `POST`, `PUT`, or `PATCH` requests.
 *
 * This function simplifies sending data by automatically stringifying the `data` payload to JSON and
 * setting the `Content-Type` header to `application/json`. Like {@link fetch}, it will parse the JSON
 * response and reject the promise on HTTP error status codes (4xx or 5xx).
 *
 * @param url The request URL.
 * @param data (optional) The data to be sent in the request body. It will be automatically stringified.
 * @param options (optional) Additional fetch options. The `method` can be overridden to 'put' or 'patch'.
 * @returns A {@link PromisE} that resolves with the parsed JSON response.
 *
 * @example Make a POST request to create a new product
 * ```typescript
 * import { post } from '@superutils/fetch';
 *
 * const newProduct = { title: 'Perfume Oil' };
 *
 * try {
 *   const createdProduct = await post('https://dummyjson.com/products/add', newProduct);
 *   console.log('Product created:', createdProduct);
 * } catch (error) {
 *   console.error('Failed to create product:', error);
 * }
 * ```
 */
export default function post<T = unknown>(
	...[url = '', data, options = {}]: PostArgs
) {
	return fetch<T>(
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
