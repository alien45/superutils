import {
	fallbackIfFails,
	isFn,
	isPositiveNumber,
	isPromise,
	isUrlValid,
	type TimeoutId,
} from '@superutils/core'
import PromisE, { type IPromisE } from '@superutils/promise'
import executeInterceptors from './executeInterceptors'
import { getAbortCtrl } from './getAbortCtrl'
import getResponse from './getResponse'
import mergeFetchOptions from './mergeFetchOptions'
import type {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	FetchCustomOptions,
	FetchErrMsgs,
	FetchOptions,
	FetchResult,
	FetchOptionsDefaults,
} from './types'
import { FetchAs, FetchError, ContentType } from './types'

/**
 * Extended `fetch` with timeout, retry, and other options. Automatically parses as JSON by default on success.
 *
 * @param url request URL
 * @param options (optional) Standard `fetch` options extended with {@link FetchCustomOptions}.
 * Default "content-type" header is 'application/json'.
 * @param options.as (optional) determines how to parse the result. Default: {@link FetchAs.json}
 * @param options.method (optional) fetch method. Default: `'get'`
 *
 * @example Make a simple HTTP requests
 * ```typescript
 * import { fetch } from '@superutils/fetch'
 *
 * // no need for `response.json()` or `result.data.data` drilling
 * fetch('https://dummyjson.com/products/1')
 * 	   .then(product => console.log(product))
 * ```
 */
export const fetch = <
	T,
	TOptions extends FetchOptions = FetchOptions,
	TAs extends FetchAs = TOptions['as'] extends FetchAs
		? TOptions['as']
		: FetchAs.json,
	TReturn = FetchResult<T>[TAs],
>(
	url: string | URL,
	options: FetchOptions & TOptions = {} as TOptions,
) => {
	let timeoutId: TimeoutId
	// make sure there's always an abort controller, so that request is aborted when promise is early finalized
	const abortCtrl: AbortController = getAbortCtrl(options)
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	const promise = new PromisE(async (resolve, reject) => {
		let errResponse: Response | undefined

		// invoke global and local request interceptors to intercept and/or transform `url` and `options`
		const _options = mergeFetchOptions(fetch.defaults, options)
		_options.as ??= FetchAs.json
		_options.method ??= 'get'
		let contentType = _options.headers.get('content-type')
		if (!contentType) {
			_options.headers.set('content-type', ContentType.APPLICATION_JSON)
			contentType = ContentType.APPLICATION_JSON
		}

		// invoke global and local response interceptors to intercept and/or transform `url` and `options`
		url = await executeInterceptors(
			url,
			_options.interceptors.request,
			_options,
		)
		const {
			as: parseAs,
			body,
			errMsgs,
			timeout,
			validateUrl = true,
		} = _options
		if (isPositiveNumber(timeout)) {
			timeoutId = setTimeout(() => abortCtrl.abort(), timeout)
		}
		if (_options.abortCtrl) _options.signal = _options.abortCtrl.signal
		try {
			if (validateUrl && !isUrlValid(url, false))
				throw new Error(errMsgs.invalidUrl)

			const shouldStringifyBody =
				[
					ContentType.APPLICATION_JSON,
					ContentType.APPLICATION_X_WWW_FORM_URLENCODED,
				].find(x => contentType.includes(x))
				&& !['undefined', 'string'].includes(typeof body)
			// stringify data/body
			if (shouldStringifyBody)
				_options.body = JSON.stringify(
					isFn(body) ? fallbackIfFails(body, [], undefined) : body,
				)

			// make the fetch call
			let response = await getResponse(url, _options)
			// invoke global and local request interceptors to intercept and/or transform `response`
			response = await executeInterceptors(
				response,
				_options.interceptors.response,
				url,
				_options,
			)
			errResponse = response
			const { status = 0 } = response
			const isSuccess = status >= 200 && status < 300
			if (!isSuccess) {
				const fallbackMsg = `${errMsgs.requestFailed} ${status}`
				const jsonError = (await fallbackIfFails(
					// try to parse error response as json first
					() => response.json(),
					[],
					undefined,
				)) as Error
				const message = jsonError?.message || fallbackMsg
				throw new Error(`${message}`.replace('Error: ', ''), {
					cause: jsonError,
				})
			}

			let result: unknown = response
			const parseFunc = response[parseAs as keyof typeof response]
			if (isFn(parseFunc)) {
				const handleErr = (err: Error) => {
					err = new Error(
						`${errMsgs.parseFailed} ${parseAs}. ${err?.message}`,
						{ cause: err },
					)
					return Promise.reject(err)
				}

				result = parseFunc.bind(response)()
				if (isPromise(result)) result = result.catch(handleErr)
				// invoke global and local request interceptors to intercept and/or transform parsed `result`
			}
			result = await executeInterceptors(
				result,
				_options.interceptors.result,
				url,
				_options,
			)
			resolve(result)
		} catch (err: unknown) {
			const errX = err as Error
			const msg =
				errX?.name === 'AbortError'
					? errMsgs.reqTimedout
					: (err as Error)?.message
			let error = new FetchError(msg, {
				cause: errX?.cause ?? err,
				response: errResponse,
				options: _options,
				url,
			})
			// invoke global and local request interceptors to intercept and/or transform `error`
			error = await executeInterceptors(
				error,
				_options.interceptors.error,
				url,
				_options,
			)

			reject(error)
		}
		timeoutId && clearTimeout(timeoutId)
	})

	// Abort fetch, in case, if fetch promise is finalized early using non-static resolve/reject methods
	promise.onEarlyFinalize.push(() => abortCtrl.abort())
	return promise as IPromisE<TReturn>
}
/** Default fetch options */
fetch.defaults = {
	errMsgs: {
		invalidUrl: 'Invalid URL',
		parseFailed: 'Failed to parse response as',
		reqTimedout: 'Request timed out',
		requestFailed: 'Request failed with status code:',
	} as Required<FetchErrMsgs>, // all error messages must be defined here
	headers: new Headers(),
	/** Global interceptors for fetch requests */
	interceptors: {
		/**
		 * Global error interceptors to be invoked whenever an exception occurs
		 * Returning an
		 */
		error: [],
		/** Interceptors to be invoked before making fetch requests */
		request: [],
		response: [],
		result: [],
	},
	/** Request timeout duration in milliseconds. Default: `0` */
	timeout: 0,
	validateUrl: true,
} as FetchOptionsDefaults

export default fetch
