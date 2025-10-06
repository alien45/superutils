import {
	fallbackIfFails,
	isFn,
	isPositiveNumber,
	isValidURL,
	TimeoutId,
} from '@utiils/core'
import PromisEBase from './PromisEBase'
import {
	FetchError,
	IPromisE,
	Interceptor,
	FetchOptions,
	FetchAs,
	FetchResult,
	FetchArgsInterceptor,
	FetchOptionsInterceptor,
} from './types'
import config from './config'
import PromisE_delay from './delay'
import mergeFetchOptions from './mergeFetchOptions'

/**
 * @name    PromisE.fetchRaw
 * @summary makes a fetch request and returns Response.
 * This DOES NOT return an instance of {@link IPromisE}.
 *
 * To set global fetch interceptors use `PromisE.config`. See {@link config} for more details.
 */
/**
 * @name    PromisE.fetch
 * @summary makes a fetch request and returns JSON.
 * Default options.headers["content-type"] is 'application/json'.
 * Will reject promise if response status code is 2xx (200 <= status < 300).
 *
 * @param	url
 * @param	o.abortCtrl (optional)
 * @param	o.method  (optional) Default: `"get"`
 * @param	o.timeout (optional) duration in milliseconds to abort the request if it takes longer.
 * @param	o.parse   (optional) specify how to parse the result.
 * Default: {@link FetchAs.json}
 * For raw `Response` use {@link FetchAs.response}
 */
export default function PromisE_fetch<
	TJSON,
	const Options extends FetchOptions = FetchOptions,
	const TReturn = Options['as'] extends FetchAs
		? FetchResult<TJSON>[Options['as']]
		: TJSON,
>(url: string | URL, allOptions: Options = {} as Options) {
	let abortCtrl: AbortController | undefined
	let timeoutId: TimeoutId
	allOptions.method ??= 'get'
	const promise = new PromisEBase(async (resolve, reject) => {
		// invoke global and local request interceptors to intercept and/or transform `url` and `options`
		const options = mergeFetchOptions(allOptions) as FetchOptionsInterceptor
		// invoke global and local response interceptors to intercept and/or transform `url` and `options`
		url = await executeInterceptors(
			url,
			options.interceptors.request,
			url,
			options,
		)
		const { as: parseAs, errMsgs, timeout } = options
		abortCtrl = options.abortCtrl
		if (isPositiveNumber(timeout)) {
			options.abortCtrl ??= new AbortController()
			timeoutId = setTimeout(() => options.abortCtrl?.abort(), timeout)
		}

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
				response,
				url,
				options,
			)
			errResponse = response
			const { status = 0 } = response
			const isSuccess = status >= 200 && status < 300
			if (!isSuccess) {
				const json = await response.json()
				const message =
					json?.message || `${errMsgs.requestFailed} ${status}.`
				const error = new Error(`${message}`.replace('Error: ', ''))
				throw error
			}
			let result: any = response
			const parseResult = (response as any)[parseAs || '']
			if (isFn(parseResult)) {
				const handleErr = (err: any) =>
					Promise.reject(
						new Error(
							[
								errMsgs.parseFailed,
								parseAs + '.',
								err.message?.replace('Error: ', ''),
							].join(' '),
							{ cause: err },
						),
					)
				result = await parseResult().catch(handleErr)

				// invoke global and local request interceptors to intercept and/or transform parsed `result`
				result = await executeInterceptors(
					result,
					options.interceptors.result,
					result,
					url,
					options,
				)
			}
			resolve(await result)
		} catch (err: any) {
			let error = new FetchError(
				err?.name === 'AbortError'
					? errMsgs.reqTimedout
					: err instanceof Error
						? err.message
						: String(err),
				{
					cause: err.cause ?? err,
					response: errResponse,
					options,
					url,
				},
			)
			// invoke global and local request interceptors to intercept and/or transform `error`
			error = await executeInterceptors(
				error,
				options.interceptors.error,
				error,
				url,
				options,
			)

			reject(error)
		}
		timeoutId && clearTimeout(timeoutId)
	}) as IPromisE<TReturn>

	// Abort fetch, in case, if fetch promise is finalized early using non-static resolve/reject methods
	abortCtrl && promise.onEarlyFinalize.push(() => abortCtrl?.abort())
	return promise
}

/** Executor interceptors and return un-/modified value */
const executeInterceptors = async <T, TArgs extends any[]>(
	value: T,
	interceptors: Interceptor<T, TArgs>[],
	...args: TArgs
) => {
	for (const interceptor of interceptors) {
		value = (await fallbackIfFails(interceptor, args, undefined)) ?? value
	}
	return value
}

/** Execute fetch(), retry if needed and return Response */
export const getResponse = async (...[url, options]: FetchArgsInterceptor) => {
	const doFetch = () =>
		fetch(url, options).catch(err =>
			err.message === 'Failed to fetch'
				? // catch network errors to allow retries
					new Response(null, {
						status: 0,
						statusText: 'Network Error',
					})
				: Promise.reject(err),
		)
	let { retry, retryBackOff, retryDelayMs, retryDelayJitter } = options
	let response = await doFetch()
	while (retry > 0 && (response.status < 200 || response.status >= 300)) {
		if (retryBackOff === 'exponential') retryDelayMs *= 2
		if (retryDelayJitter) retryDelayMs += Math.floor(Math.random() * 100)
		await PromisE_delay(retryDelayMs)
		response = await doFetch()
		retry--
	}
	return response
}
