import {
	fallbackIfFails,
	isFn,
	isPositiveNumber,
	isPromise,
	isUrlValid,
} from '@superutils/core'
import {
	IPromisE_Timeout,
	timeout as PromisE_timeout,
} from '@superutils/promise'
import executeInterceptors from './executeInterceptors'
import getResponse from './getResponse'
import mergeFetchOptions from './mergeFetchOptions'
import type {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	FetchCustomOptions,
	FetchOptions,
	FetchResult,
} from './types'
import {
	ContentType,
	FetchAs,
	FetchErrMsgs,
	FetchError,
	FetchOptionsDefault,
} from './types'

/** Node.js setTimeout limit is 2147483647 (2^31-1). Larger values fire immediately. */
export const MAX_TIMEOUT = 2147483647
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
): IPromisE_Timeout<TReturn> => {
	let errResponse: Response | undefined
	// invoke global and local request interceptors to intercept and/or transform `url` and `options`
	const _options = mergeFetchOptions(fetch.defaults, options)
	// make sure there's always an abort controller, so that request is aborted when promise is early finalized
	_options.abortCtrl = getAbortCtrl(_options)
	_options.as ??= FetchAs.json
	_options.method ??= 'get'
	_options.signal ??= _options.abortCtrl.signal
	_options.timeout = Math.min(
		isPositiveNumber(_options.timeout)
			? _options.timeout
			: fetch.defaults.timeout,
		MAX_TIMEOUT,
	)
	const { abortCtrl, as: parseAs, headers, timeout } = _options
	let contentType = headers.get('content-type')
	if (!contentType) {
		headers.set('content-type', ContentType.APPLICATION_JSON)
		contentType = ContentType.APPLICATION_JSON
	}

	const processErr = (err: Error) => {
		let msg = err?.message ?? err
		if (err?.name === 'AbortError') msg = _options.errMsgs?.aborted ?? msg
		// invoke global and local request interceptors to intercept and/or transform `error`
		return executeInterceptors(
			new FetchError(msg, {
				cause: err?.cause ?? err,
				response: errResponse,
				options: _options,
				url,
			}),
			undefined, // should execute regardless of abort status
			_options.interceptors?.error,
			url,
			_options,
		).then(err => Promise.reject(err))
	}
	const start = async () => {
		try {
			// invoke global and local response interceptors to intercept and/or transform `url` and `options`
			url = await executeInterceptors(
				url,
				abortCtrl.signal,
				_options.interceptors?.request,
				_options,
			)
			const { body, errMsgs, validateUrl = true } = _options
			_options.signal ??= abortCtrl.signal
			if (validateUrl && !isUrlValid(url, false))
				return processErr(new Error(errMsgs.invalidUrl))

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
				abortCtrl.signal,
				_options.interceptors?.response,
				url,
				_options,
			)
			errResponse = response
			const { status = 0 } = response
			const isSuccess = status >= 200 && status < 300
			if (!isSuccess) {
				const jsonError: unknown = await fallbackIfFails(
					// try to parse error response as json first
					() => response.json(),
					[],
					undefined,
				)
				throw new Error(
					(jsonError as Error)?.message
						|| `${errMsgs.requestFailed} ${status}`,
					{ cause: jsonError },
				)
			}

			const parseFunc = response[parseAs as keyof typeof response]
			let result: unknown = !isFn(parseFunc)
				? response
				: parseFunc.bind(response)()
			if (isPromise(result))
				result = await result.catch((err: Error) =>
					Promise.reject(
						new Error(
							`${errMsgs.parseFailed} ${parseAs}. ${err?.message}`,
							{ cause: err },
						),
					),
				)
			// invoke global and local request interceptors to intercept and/or transform parsed `result`
			result = await executeInterceptors(
				result,
				abortCtrl.signal,
				_options.interceptors?.result,
				url,
				_options,
			)
			return result as TReturn
		} catch (_err: unknown) {
			return processErr(_err as Error)
		}
	}
	return PromisE_timeout(
		{
			...options,
			abortCtrl,
			onAbort: () => processErr(new Error(_options.errMsgs.aborted)),
			onTimeout: async () =>
				processErr(new Error(_options.errMsgs.timedout)),
			signal: _options.signal,
			timeout,
		},
		start,
	) as IPromisE_Timeout<TReturn>
}
/** Default fetch options */
fetch.defaults = {
	errMsgs: {
		aborted: 'Request aborted',
		invalidUrl: 'Invalid URL',
		parseFailed: 'Failed to parse response as',
		timedout: 'Request timed out',
		requestFailed: 'Request failed with status code:',
	} as Required<FetchErrMsgs>, // all error messages must be defined here
	headers: new Headers(),
	interceptors: {
		error: [],
		request: [],
		response: [],
		result: [],
	},
	timeout: 30_000,
	validateUrl: true,
} as FetchOptionsDefault

/**
 * Add AbortController to options if not present and propagate external abort signal if provided.
 *
 * @param options The fetch options object.
 *
 * @returns The AbortController instance associated with the options.
 */
const getAbortCtrl = (options: Partial<FetchOptions>): AbortController => {
	options ??= {}
	if (!(options.abortCtrl instanceof AbortController))
		options.abortCtrl = new AbortController()

	const { abortCtrl, signal } = options

	if (signal instanceof AbortSignal && !signal.aborted) {
		// propagate abort signal
		const handleAbort = () => abortCtrl.abort()
		signal.addEventListener('abort', handleAbort, { once: true })

		abortCtrl.signal.addEventListener(
			'abort',
			() => signal.removeEventListener('abort', handleAbort),
			{ once: true },
		)
	}

	return abortCtrl
}

export default fetch
