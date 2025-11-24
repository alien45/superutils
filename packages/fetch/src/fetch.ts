import {
	asAny,
	fallbackIfFails,
	isFn,
	isPositiveNumber,
	isUrlValid,
	type TimeoutId,
} from '@superutils/core'
import PromisE, { type IPromisE, ThePromise } from '@superutils/promise'
import mergeFetchOptions from './mergeFetchOptions'
import {
	type FetchArgsInterceptor,
	type FetchAs,
	FetchError,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	FetchInterceptors,
	type FetchOptions,
	type FetchResult,
	type Interceptor,
} from './types'

/**
 * @summary	makes a fetch request and returns JSON.
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
export function fetcher<
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
	const promise = new PromisE(async (resolve, reject) => {
		// invoke global and local request interceptors to intercept and/or transform `url` and `options`
		const options = mergeFetchOptions(fetchOptions)
		// avoid interceptors' mutations during interceptor calls
		const errorInterceptors = [...options.interceptors.error]
		const requestInterceptors = [...options.interceptors.request]
		const responseInterceptors = [...options.interceptors.response]
		const resultInterceptors = [...options.interceptors.result]
		// invoke global and local response interceptors to intercept and/or transform `url` and `options`
		url = await executeInterceptors(url, requestInterceptors, url, options)
		const { as: parseAs, errMsgs, timeout } = options
		if (isPositiveNumber(timeout)) {
			options.abortCtrl ??= new AbortController()
			timeoutId = setTimeout(() => options.abortCtrl?.abort(), timeout)
		}
		abortCtrl = options.abortCtrl
		if (options.abortCtrl) options.signal = options.abortCtrl.signal
		let errResponse: Response | undefined
		try {
			// eslint-disable-next-line @typescript-eslint/only-throw-error
			if (!isUrlValid(url, false)) throw errMsgs.invalidUrl //new Error()
			// make the fetch call
			let response = await getResponse(url, options)
			// invoke global and local request interceptors to intercept and/or transform `response`
			response = await executeInterceptors(
				response,
				responseInterceptors,
				url,
				options,
			)
			errResponse = response
			const { status = 0 } = response
			const isSuccess = status >= 200 && status < 300
			if (!isSuccess) {
				const json = (await response.json()) as Error
				const message =
					json?.message || `${errMsgs.requestFailed} ${status}.`
				throw new Error(`${message}`.replace('Error: ', ''), {
					cause: json,
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
					return ThePromise.reject(err)
				}
				result = await (parseFunc() as Promise<TReturn>)?.catch(
					handleErr,
				)

				// invoke global and local request interceptors to intercept and/or transform parsed `result`
				result = await executeInterceptors(
					result,
					resultInterceptors,
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
				errorInterceptors,
				url,
				options,
			)

			reject(error)
		}
		timeoutId && clearTimeout(timeoutId)
	})

	// Abort fetch, in case, if fetch promise is finalized early using non-static resolve/reject methods
	promise.onEarlyFinalize.push(() => abortCtrl?.abort())
	return promise as IPromisE<TReturn>
}
export default fetcher

/** Gracefully execute interceptors and return un-/modified value */
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
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		value = (await fallbackIfFails(..._args)) ?? value
	}
	return value
}

/** Execute fetch(), retry if needed and return Response */
export const getResponse = async (...[url, options]: FetchArgsInterceptor) => {
	const goGetch = () =>
		fetch(url, options).catch((err: Error) =>
			err.message === 'Failed to fetch'
				? // catch network errors to allow retries
					new Response(null, {
						status: 0,
						statusText: 'Network Error',
					})
				: ThePromise.reject(err),
		)

	const response = await PromisE.retry(goGetch, {
		...options,
		retryIf: (r?: Response) => !r?.ok,
	}).catch(err => {
		if (!options.retry) return Promise.reject(err as Error)
		const msg = `Request failed after attempt #${(options.retry || 0) + 1}`
		return Promise.reject(new Error(msg, { cause: err }))
	})
	return response
}
