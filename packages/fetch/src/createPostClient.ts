import PromisE, { IPromisE } from '@superutils/promise'
import fetchOriginal from './fetch'
import { mergePartialOptions } from './mergeFetchOptions'
import {
	DeferredAsyncOptions,
	ExcludePostOptions,
	FetchAs,
	FetchAsFromOptions,
	FetchResult,
	PostArgs,
	PostDeferredCbArgs,
	PostOptions,
} from './types'

/**
 * Create a reusable fetch client with shared options. The returned function comes attached with a
 * `.deferred()` function for debounced and throttled request.
 */
export const createPostClient = <
	MandatoryOpts extends PostOptions | undefined,
	CommonOpts extends ExcludePostOptions<MandatoryOpts> | undefined,
	MandatoryAs extends FetchAs | undefined = FetchAsFromOptions<
		MandatoryOpts,
		undefined
	>,
>(
	/** Mandatory fetch options that cannot be overriden by individual request */
	mandatoryOptions?: MandatoryOpts,
	/** Common fetch options that can be overriden by individual request */
	commonOptions?: PostOptions & CommonOpts,
	commonDeferOptions?: DeferredAsyncOptions<unknown, unknown>,
) => {
	const func = <
		T,
		TOptions extends ExcludePostOptions<MandatoryOpts> | undefined,
		TAs extends FetchAs = MandatoryAs extends FetchAs
			? MandatoryAs
			: FetchAsFromOptions<TOptions, FetchAsFromOptions<CommonOpts>>,
		TReturn = FetchResult<T>[TAs],
	>(
		url: PostArgs[0],
		data?: PostArgs[1],
		options?: TOptions,
	) => {
		const _options = mergePartialOptions(
			commonOptions,
			options,
			mandatoryOptions,
		) as PostOptions
		_options.body = data
		_options.method ??= 'post'
		return fetchOriginal(url, _options) as unknown as IPromisE<TReturn>
	}

	/** Make debounced/throttled request */
	func.deferred = <
		ThisArg = unknown,
		TDelay extends number = number,
		DefaultUrl extends PostArgs[0] | undefined = PostArgs[0] | undefined,
		DefaultData extends PostArgs[1] = PostArgs[1],
		DefaultOptions extends ExcludePostOptions<MandatoryOpts> | undefined =
			| ExcludePostOptions<MandatoryOpts>
			| undefined,
	>(
		deferOptions: DeferredAsyncOptions<ThisArg, TDelay> = {},
		defaultUrl?: DefaultUrl,
		defaultData?: DefaultData,
		defaultOptions?: DefaultOptions,
	) => {
		let _abortCtrl: AbortController | undefined
		const postCb = <
			TResult = unknown,
			TOptions extends ExcludePostOptions<MandatoryOpts> | undefined =
				| ExcludePostOptions<MandatoryOpts>
				| undefined,
			TAs extends FetchAs = MandatoryAs extends FetchAs
				? MandatoryAs
				: FetchAsFromOptions<TOptions, FetchAsFromOptions<CommonOpts>>,
			TReturn = FetchResult<TResult>[TAs],
		>(
			...args: PostDeferredCbArgs<DefaultUrl, DefaultData, TOptions>
		) => {
			// add default url to the beginning of the array
			if (defaultUrl !== undefined) args.splice(0, 0, defaultUrl)
			// add default data after the url
			if (defaultData !== undefined) args.splice(1, 0, defaultData)
			const options = mergePartialOptions(
				commonOptions,
				defaultOptions,
				args[2] as TOptions,
				mandatoryOptions,
			) as PostOptions

			options.abortCtrl ??= new AbortController()
			// make sure to abort any previous pending request
			_abortCtrl?.abort?.()
			_abortCtrl = options.abortCtrl
			// attach body to options
			options.body = (args[1] ?? options.body) as PostArgs[1]
			options.method ??= 'post'
			const promise = fetchOriginal(args[0] as PostArgs[0], options)
			// abort fetch request if promise is finalized manually before completion
			// by invoking `promise.reject()` or `promise.resolve()
			promise.onEarlyFinalize.push(() => _abortCtrl?.abort())
			return promise as IPromisE<TReturn>
		}

		return PromisE.deferredCallback(postCb, {
			...commonDeferOptions,
			...deferOptions,
		} as typeof deferOptions) as typeof postCb
	}

	return func
}
export default createPostClient
