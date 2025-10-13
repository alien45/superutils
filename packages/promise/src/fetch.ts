import {
	asAny,
	fallbackIfFails,
	isFn,
	isPositiveNumber,
	isValidURL,
	type TimeoutId,
} from '@superutils/core'
import PromisE_delay from './delay'
import mergeFetchOptions from './mergeFetchOptions'
import PromisEBase from './PromisEBase'
import {
	type FetchArgsInterceptor,
	type FetchAs,
	FetchError,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	FetchInterceptors,
	type FetchOptions,
	type FetchResult,
	type Interceptor,
	type IPromisE,
	ThePromise,
} from './types'

/**
 * @function    PromisE.fetch
 * @summary makes a fetch request and returns JSON.
 * Default options.headers["content-type"] is 'application/json'.
 * Will reject promise if response status code is 2xx (200 <= status < 300).
 *
 * @param	url
 * @param	o.abortCtrl (optional)
 * @param	o.interceptors (optional) request interceptor callbacks.  See {@link FetchInterceptors} for details.
 * @param	o.method  (optional) Default: `"get"`
 * @param	o.timeout (optional) duration in milliseconds to abort the request if it takes longer.
 * @param	o.parse   (optional) specify how to parse the result.
 * Default: {@link FetchAs.json}
 * For raw `Response` use {@link FetchAs.response}
 */
export default function PromisE_fetch<
	TJSON = unknown,
	TOptions extends FetchOptions = FetchOptions,
	TReturn = TOptions['as'] extends FetchAs
		? FetchResult<TJSON>[TOptions['as']]
		: TJSON,
>(url: string | URL, fetchOptions: TOptions & FetchOptions = {} as TOptions) {
	let abortCtrl: AbortController | undefined
	let timeoutId: TimeoutId
	fetchOptions.method ??= 'get'
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	const promise = new PromisEBase(async (resolve, reject) => {
		// invoke global and local request interceptors to intercept and/or transform `url` and `options`
		const options = mergeFetchOptions(fetchOptions)
		// invoke global and local response interceptors to intercept and/or transform `url` and `options`
		url = await executeInterceptors(
			url,
			options.interceptors.request,
			url,
			options,
		)
		const { as: parseAs, errMsgs, timeout } = options
		if (isPositiveNumber(timeout)) {
			options.abortCtrl ??= new AbortController()
			timeoutId = setTimeout(() => options.abortCtrl?.abort(), timeout)
		}
		abortCtrl = options.abortCtrl
		if (options.abortCtrl) options.signal = options.abortCtrl.signal
		let errResponse: Response | undefined
		try {
			if (!isValidURL(url, false)) throw new Error(errMsgs.invalidUrl)
			// make the fetch call
			let response = await getResponse(url, options)
			// invoke global and local request interceptors to intercept and/or transform `response`
			response = await executeInterceptors(
				response,
				options.interceptors.response,
				url,
				options,
			)
			errResponse = response
			const { status = 0 } = response
			const isSuccess = status >= 200 && status < 300
			if (!isSuccess) {
				const json: Error = (await response.json()) as Error
				const message =
					json?.message || `${errMsgs.requestFailed} ${status}.`
				const error = new Error(`${message}`.replace('Error: ', ''))
				throw error
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
					return ThePromise.reject(err)
				}
				result = await (parseFunc() as Promise<TReturn>)?.catch(
					handleErr,
				)

				// invoke global and local request interceptors to intercept and/or transform parsed `result`
				result = await executeInterceptors(
					result,
					options.interceptors.result,
					url,
					options,
				)
			}
			resolve((await result) as TReturn)
		} catch (err: unknown) {
			const errX = asAny<Error>(err)
			let error = new FetchError(
				errX?.name === 'AbortError'
					? errMsgs.reqTimedout
					: err instanceof Error
						? err.message
						: String(err),
				{
					cause: errX?.cause ?? err,
					response: errResponse,
					options,
					url,
				},
			)
			// invoke global and local request interceptors to intercept and/or transform `error`
			error = await executeInterceptors(
				error,
				options.interceptors.error,
				url,
				options,
			)

			reject(error)
		}
		timeoutId && clearTimeout(timeoutId)
	}) as IPromisE<TReturn>

	// Abort fetch, in case, if fetch promise is finalized early using non-static resolve/reject methods
	promise.onEarlyFinalize.push(() => abortCtrl?.abort())
	return promise
}

/** Executor interceptors and return un-/modified value */
const executeInterceptors = async <
	T,
	TArgs extends unknown[],
	TArgs2 extends unknown[] = [value: T, ...TArgs],
>(
	value: T,
	interceptors: Interceptor<T, TArgs, TArgs2>[],
	...args: TArgs
) => {
	for (const interceptor of interceptors.filter(isFn)) {
		const _args = [interceptor, [value, args] as TArgs2, value] as const
		value = (await fallbackIfFails(..._args)) ?? value
	}
	return value
}

/** Execute fetch(), retry if needed and return Response */
export const getResponse = async (...[url, options]: FetchArgsInterceptor) => {
	const doFetch = () =>
		fetch(url, options).catch((err: Error) =>
			err.message === 'Failed to fetch'
				? // catch network errors to allow retries
					new Response(null, {
						status: 0,
						statusText: 'Network Error',
					})
				: ThePromise.reject(err),
		)
	const { retry, retryBackOff, retryDelayJitter } = options
	let { retryDelayMs } = options
	let _retry = retry
	let response = await doFetch()
	while (_retry > 0 && (response.status < 200 || response.status >= 300)) {
		if (retryBackOff === 'exponential' && retry !== _retry)
			retryDelayMs *= 2
		if (retryDelayJitter) retryDelayMs += Math.floor(Math.random() * 100)
		await PromisE_delay(retryDelayMs)
		response = await doFetch()
		_retry--
	}
	return response
}
