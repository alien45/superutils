'use strict'

import {
	fallbackIfFails,
	isError,
	isObj,
	isPromise,
	isUrlValid,
} from '@superutils/core'
import { timeout as PromisE_timeout } from '@superutils/promise'
import executeInterceptors from './executeInterceptors'
import getResponse from './getResponse'
import getResult from './getResult'
import mergeOptions from './mergeOptions'
import type {
	FetchArgs,
	FetchOptions,
	FetchOptionsInterceptor,
	FetchResult,
	IPromise_Fetch,
	PostBody,
} from './types'
import {
	ContentType,
	FetchAs,
	FetchErrMsgs,
	FetchError,
	FetchOptionsDefault,
	POST_METHODS,
} from './types'

export const defaultErrorMsgs = Object.freeze({
	aborted: 'Request aborted',
	invalidUrl: 'Invalid URL',
	parseFailed: 'Failed to parse response as',
	timedout: 'Request timed out',
	requestFailed: 'Request failed with status code:',
}) as Required<FetchErrMsgs>

const fetch = <
	T = unknown,
	TOptions extends FetchOptions = FetchOptions,
	TAs extends FetchAs = TOptions['as'] extends FetchAs
		? TOptions['as']
		: FetchAs.response,
	TReturn = FetchResult<T>[TAs],
>(
	url: FetchArgs[0],
	options: FetchOptions & TOptions = {} as TOptions,
) => {
	// let url = url instanceof Request ? url.url : url
	if (!isObj(options)) options = {} as TOptions

	let response: Response | undefined
	// merge `defaults` with `options` to make sure default values are used where appropriate
	const opts = mergeOptions(
		{ errMsgs: defaultErrorMsgs },
		options.ignoreGlobalDefaults ? undefined : fetch.defaults,
		options,
	)

	// make sure there's always an abort controller, so that request is aborted when promise is early finalized
	opts.abortCtrl =
		opts.abortCtrl instanceof AbortController
			? opts.abortCtrl
			: new AbortController()
	opts.as ??= FetchAs.response
	opts.method ??= 'GET'
	opts.signal ??= opts.abortCtrl.signal
	const { abortCtrl, as: parseAs, headers, onAbort, onTimeout } = opts
	opts.onAbort = async () => {
		const err: Error = await fallbackIfFails(onAbort, [], undefined)

		return await interceptErr(
			isError(err) ? err : new Error(err),
			url,
			opts,
			response,
		)
	}
	opts.onTimeout = async () => {
		const err = await fallbackIfFails(onTimeout, [], undefined)
		return await interceptErr(
			err ?? new Error(opts.errMsgs.timedout),
			url,
			opts,
			response,
		)
	}
	return PromisE_timeout(opts, async () => {
		try {
			// invoke body function before executing request interceptors
			opts.body = await fallbackIfFails(
				opts.body as unknown as Promise<PostBody>,
				[],
				(err: Error) => Promise.reject(err),
			)

			// invoke global and local response interceptors to intercept and/or transform `url` and `options`
			url = await executeInterceptors(
				url,
				abortCtrl.signal,
				opts.interceptors?.request,
				opts,
			)

			const { body, errMsgs, validateUrl = false } = opts
			opts.signal ??= abortCtrl.signal
			if (validateUrl && !isUrlValid(url, false))
				throw new Error(errMsgs.invalidUrl)

			const stringify =
				POST_METHODS.includes(
					`${opts.method}`.toUpperCase() as (typeof POST_METHODS)[number],
				)
				&& !['undefined', 'string'].includes(typeof body)
				&& isObj(body, true)
				&& headers.get('content-type') === ContentType.APPLICATION_JSON
			// stringify body
			if (stringify) opts.body = JSON.stringify(opts.body)

			// make the fetch call
			response = await getResponse(url, opts)
			// invoke global and local request interceptors to intercept and/or transform `response`
			response = await executeInterceptors(
				response,
				abortCtrl.signal,
				opts.interceptors?.response,
				url,
				opts,
			)
			const status = response?.status
			const isSuccess = status >= 200 && status < 300
			if (!isSuccess) {
				const jsonError: unknown = await fallbackIfFails(
					// try to parse error response as json first
					() => response?.clone()?.json(),
					[],
					undefined,
				)
				throw new Error((jsonError as Error)?.message ?? jsonError, {
					cause: jsonError,
				})
			}

			let result: unknown = getResult(
				response,
				parseAs,
				opts.onDownloadProgress,
			)
			if (isPromise(result)) {
				result = await result.catch((err: Error) =>
					Promise.reject(
						new Error(
							`${errMsgs.parseFailed} ${parseAs}. ${err?.message}`,
							{ cause: err },
						),
					),
				)
			}
			// invoke global and local request interceptors to intercept and/or transform parsed `result`
			result = await executeInterceptors(
				result,
				abortCtrl.signal,
				opts.interceptors?.result,
				url,
				opts,
			)
			return result as TReturn
		} catch (_err: unknown) {
			let err = _err as Error

			err = await interceptErr(_err as Error, url, opts, response)
			return Promise.reject(err as FetchError)
		}
	}) as IPromise_Fetch<TReturn>
}
/** Global default fetch options */
fetch.defaults = {
	abortOnEarlyFinalize: true,
	errMsgs: { ...defaultErrorMsgs }, // all error messages must be defined here
	headers: new Headers(),
	interceptors: {
		error: [],
		request: [],
		response: [],
		result: [],
	},
	timeout: 60_000,
	validateUrl: false,
} as FetchOptionsDefault

/**
 * Internal helper to handle and intercept errors.
 *
 * @param err The error to intercept.
 * @param url The original request URL.
 * @param options The interceptor options.
 * @param response The response object, if available.
 * @returns A promise resolving to the (potentially transformed) FetchError.
 */
const interceptErr = async (
	err: Error,
	url: FetchArgs[0],
	options: FetchOptionsInterceptor,
	response?: Response,
) => {
	// invoke global and local request interceptors to intercept and/or transform `error`
	const fErr = await executeInterceptors(
		new FetchError(
			(err?.message ?? err)
				|| `${options.errMsgs.requestFailed} ${response?.status}`,
			{
				cause: err?.cause ?? err,
				response: response,
				options: options,
				url,
			},
		),
		undefined, // should execute regardless of abort status
		options.interceptors?.error,
		url,
		options,
	)
	return fErr
}

export default fetch
