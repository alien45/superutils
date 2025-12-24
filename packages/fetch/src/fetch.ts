import {
	fallbackIfFails,
	isEmpty,
	isFn,
	isPositiveNumber,
	isPromise,
	isUrlValid,
	type TimeoutId,
} from '@superutils/core'
import PromisE, { type IPromisE } from '@superutils/promise'
import executeInterceptors from './executeInterceptors'
import getResponse from './getResponse'
import mergeFetchOptions from './mergeFetchOptions'
import {
	FetchAs,
	FetchError,
	FetchErrMsgs,
	type FetchOptions,
	type FetchResult,
	FetchOptionsDefaults,
} from './types'

export const fetch = <
	T,
	TOptions extends FetchOptions = FetchOptions,
	TReturn = TOptions['as'] extends FetchAs
		? FetchResult<T>[TOptions['as']]
		: T,
>(
	url: string | URL,
	options: TOptions = {} as TOptions,
) => {
	let abortCtrl: AbortController | undefined
	let timeoutId: TimeoutId
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	const promise = new PromisE(async (resolve, reject) => {
		// invoke global and local request interceptors to intercept and/or transform `url` and `options`
		const _options = mergeFetchOptions(fetch.defaults, options)
		if (isEmpty(_options.method)) _options.method = 'get'
		// avoid interceptors' mutations during interceptor calls
		const errorInterceptors = [..._options.interceptors.error]
		const requestInterceptors = [..._options.interceptors.request]
		const responseInterceptors = [..._options.interceptors.response]
		const resultInterceptors = [..._options.interceptors.result]
		// invoke global and local response interceptors to intercept and/or transform `url` and `options`
		url = await executeInterceptors(url, requestInterceptors, url, _options)
		const { as: parseAs, errMsgs, timeout } = _options
		if (isPositiveNumber(timeout)) {
			_options.abortCtrl ??= new AbortController()
			timeoutId = setTimeout(() => _options.abortCtrl?.abort(), timeout)
		}
		abortCtrl = _options.abortCtrl
		if (_options.abortCtrl) _options.signal = _options.abortCtrl.signal
		let errResponse: Response | undefined
		try {
			if (!isUrlValid(url, false)) throw new Error(errMsgs.invalidUrl)
			// make the fetch call
			let response = await getResponse(url, _options)
			// invoke global and local request interceptors to intercept and/or transform `response`
			response = await executeInterceptors(
				response,
				responseInterceptors,
				url,
				_options,
			)
			errResponse = response
			const { status = 0 } = response
			const isSuccess = status >= 200 && status < 300
			if (!isSuccess) {
				const jsonError = (await fallbackIfFails(
					// try to parse error response as json first
					() => response.json(),
					[],
					// fallback to text if json parsing fails
					`Request failed with status code: ${status}`,
				)) as Error
				const message =
					jsonError?.message || `${errMsgs.requestFailed} ${status}.`
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
					return globalThis.Promise.reject(err)
				}

				result = parseFunc.bind(response)()
				if (isPromise(result)) result = result.catch(handleErr)
				// invoke global and local request interceptors to intercept and/or transform parsed `result`
				result = await executeInterceptors(
					result,
					resultInterceptors,
					url,
					_options,
				)
			}
			resolve(result as TReturn)
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
				errorInterceptors,
				url,
				_options,
			)

			reject(error)
		}
		timeoutId && clearTimeout(timeoutId)
	})

	// Abort fetch, in case, if fetch promise is finalized early using non-static resolve/reject methods
	promise.onEarlyFinalize.push(() => abortCtrl?.abort())
	return promise as IPromisE<TReturn>
}
/** Default fetch options */
fetch.defaults = {
	as: FetchAs.json,
	errMsgs: {
		invalidUrl: 'Invalid URL',
		parseFailed: 'Failed to parse response as',
		reqTimedout: 'Request timed out',
		requestFailed: 'Request failed with status code:',
	} as Required<FetchErrMsgs>, // all error messages must be defined here
	headers: new Headers([['content-type', 'application/json']]),
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
	timeout: 0,
} as FetchOptionsDefaults
export default fetch
