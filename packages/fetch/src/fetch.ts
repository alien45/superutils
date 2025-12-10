import {
	isEmpty,
	isFn,
	isPositiveNumber,
	isPromise,
	isUrlValid,
	type TimeoutId,
} from '@superutils/core'
import PromisE, { type IPromisE } from '@superutils/promise'
import mergeFetchOptions from './mergeFetchOptions'
import {
	FetchAs,
	FetchError,
	FetchErrMsgs,
	FetchOptionsInterceptor,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	FetchInterceptors,
	type FetchOptions,
	type FetchResult,
} from './types'
import executeInterceptors from './executeInterceptors'
import getResponse from './getResponse'

export const fetch = <
	TJSON,
	TOptions extends FetchOptions = FetchOptions,
	TReturn = TOptions['as'] extends FetchAs
		? FetchResult<TJSON>[TOptions['as']]
		: TJSON,
>(
	url: string | URL,
	options: TOptions = {} as TOptions,
) => {
	let abortCtrl: AbortController | undefined
	let timeoutId: TimeoutId
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	const promise = new PromisE(async (resolve, reject) => {
		// invoke global and local request interceptors to intercept and/or transform `url` and `options`
		const _options = mergeFetchOptions(defaults, options)
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
			// eslint-disable-next-line @typescript-eslint/only-throw-error
			if (!isUrlValid(url, false)) throw errMsgs.invalidUrl
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
				const jsonError = (await response.json()) as Error
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
						[
							errMsgs.parseFailed,
							parseAs + '.',
							`${err?.message ?? err}`?.replace('Error: ', ''),
						].join(' '),
						{ cause: err },
					)
					return globalThis.Promise.reject(err)
				}

				result = parseFunc()
				if (isPromise(result)) result = result.catch(handleErr)
				// invoke global and local request interceptors to intercept and/or transform parsed `result`
				result = await executeInterceptors(
					result,
					resultInterceptors,
					url,
					_options,
				)
			}
			resolve((await result) as TReturn)
		} catch (err: unknown) {
			const errX = err as Error
			let error = new FetchError(
				errX?.name === 'AbortError'
					? errMsgs.reqTimedout
					: err instanceof Error
						? err.message
						: String(err),
				{
					cause: errX?.cause ?? err,
					response: errResponse,
					options: _options,
					url,
				},
			)
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
const defaults = {
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
} as Omit<FetchOptionsInterceptor, 'method' | 'retryIf'>
fetch.defaults = defaults
export default fetch
