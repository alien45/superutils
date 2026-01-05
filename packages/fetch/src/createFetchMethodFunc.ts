import fetchOriginal from './fetch'
import fetchDeferred from './fetchDeferred'
import { FetchArgs, FetchAs, FetchOptions, FetchResult } from './types'

/** Create a method-specific fetch function attached with a `.deferred()` function */
export const createFetchMethodFunc = (
	method: Pick<FetchOptions, 'method'>['method'] = 'get',
) => {
	const methodFunc = <
		T,
		TOptions extends FetchOptions = FetchOptions,
		TAs extends FetchAs = TOptions['as'] extends FetchAs
			? TOptions['as']
			: FetchAs.json,
		TReturn = FetchResult<T>[TAs],
	>(
		...args: Parameters<typeof fetchOriginal<T, TOptions, TAs, TReturn>>
	) => {
		args[1] ??= {} as TOptions
		;(args[1] as FetchOptions).method = method
		return fetchOriginal<T, FetchOptions>(...args)
	}

	/** Make debounced/throttled request */
	methodFunc.deferred = <
		ThisArg = unknown,
		Delay extends number = number,
		GlobalUrl = FetchArgs[0] | undefined,
		CbArgs extends unknown[] = undefined extends GlobalUrl
			? FetchArgs<true> // true: deny callback overriding 'method' in options
			: [options?: FetchArgs<true>[1]],
	>(
		...args: Parameters<
			typeof fetchDeferred<ThisArg, Delay, GlobalUrl, CbArgs>
		>
	) => {
		args[2] ??= {}
		args[2].method = method
		return fetchDeferred(...args)
	}

	return methodFunc
}
export default createFetchMethodFunc
