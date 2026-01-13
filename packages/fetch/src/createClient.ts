import PromisE, { IPromisE } from '@superutils/promise'
import fetchOriginal from './fetch'
import { mergePartialOptions } from './mergeFetchOptions'
import {
	DeferredAsyncOptions,
	ExcludeOptions,
	FetchArgs,
	FetchAs,
	FetchAsFromOptions,
	FetchOptions,
	FetchResult,
} from './types'

/**
 * Create a reusable fetch client with shared options. The returned function comes attached with a
 * `.deferred()` function for debounced and throttled request.
 */
export const createClient = <
	MandatoryOpts extends FetchOptions | undefined,
	CommonOpts extends ExcludeOptions<MandatoryOpts> | undefined,
	MandatoryAs extends FetchAs | undefined = FetchAsFromOptions<
		MandatoryOpts,
		undefined
	>,
>(
	/** Mandatory fetch options that cannot be overriden by individual request */
	mandatoryOptions?: MandatoryOpts,
	/** Common fetch options that can be overriden by individual request */
	commonOptions?: FetchOptions & CommonOpts,
	commonDeferOptions?: DeferredAsyncOptions<unknown, unknown>,
) => {
	const func = <
		T,
		TOptions extends ExcludeOptions<MandatoryOpts> | undefined =
			| ExcludeOptions<MandatoryOpts>
			| undefined,
		TAs extends FetchAs = MandatoryAs extends FetchAs
			? MandatoryAs
			: FetchAsFromOptions<TOptions, FetchAsFromOptions<CommonOpts>>,
		TReturn = FetchResult<T>[TAs],
	>(
		url: FetchArgs[0],
		options?: TOptions,
	) => {
		return fetchOriginal(
			url,
			mergePartialOptions(
				commonOptions,
				options,
				mandatoryOptions,
			) as TOptions,
		) as unknown as IPromisE<TReturn>
	}

	/** Make debounced/throttled request */
	func.deferred = <
		ThisArg = unknown,
		TDelay extends number = number,
		DefaultUrl extends FetchArgs[0] | undefined = FetchArgs[0] | undefined,
		DefaultOptions extends ExcludeOptions<MandatoryOpts> | undefined =
			| ExcludeOptions<MandatoryOpts>
			| undefined,
	>(
		deferOptions: DeferredAsyncOptions<ThisArg, TDelay> = {},
		defaultUrl?: DefaultUrl,
		defaultOptions?: DefaultOptions,
	) => {
		let _abortCtrl: AbortController | undefined
		const fetchCb = <
			TResult = unknown,
			TOptions extends ExcludeOptions<MandatoryOpts> | undefined =
				| ExcludeOptions<MandatoryOpts>
				| undefined,
			TAs extends FetchAs = MandatoryAs extends FetchAs
				? MandatoryAs
				: FetchAsFromOptions<TOptions, FetchAsFromOptions<CommonOpts>>,
			TReturn = FetchResult<TResult>[TAs],
		>(
			...args: DefaultUrl extends undefined
				? [url: FetchArgs[0], options?: TOptions]
				: [options?: TOptions]
		) => {
			const options = mergePartialOptions(
				commonOptions,
				defaultOptions,
				(defaultUrl === undefined ? args[1] : args[0]) as TOptions,
				mandatoryOptions,
			) as FetchOptions

			options.abortCtrl ??= new AbortController()
			// make sure to abort any previous pending request
			_abortCtrl?.abort?.()
			_abortCtrl = options.abortCtrl
			const promise = fetchOriginal(
				(defaultUrl ?? args[0]) as FetchArgs[0],
				options,
			)
			// abort fetch request if promise is finalized manually before completion
			// by invoking `promise.reject()` or `promise.resolve()
			promise.onEarlyFinalize.push(() => _abortCtrl?.abort())
			return promise as IPromisE<TReturn>
		}

		return PromisE.deferredCallback(fetchCb, {
			...commonDeferOptions,
			...deferOptions,
		} as typeof deferOptions) as typeof fetchCb
	}

	return func
}
export default createClient
