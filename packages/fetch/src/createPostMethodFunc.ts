import post from './post'
import postDeferred from './postDeferred'
import { PostArgs, PostDeferredCbArgs, PostOptions } from './types'

/**
 * Create a method-specific function for POST-like methods that automatically stringifies `data`
 * and attached with a `.deferred()` function
 */
export const createPostMethodFunc = (
	method: Pick<PostOptions, 'method'>['method'] = 'post',
) => {
	const methodFunc = <T, Args extends PostArgs<true> = PostArgs<true>>(
		url: Args[0],
		data?: Args[1],
		options?: Args[2],
	) => {
		options ??= {}
		;(options as PostOptions).method = method
		return post<T>(url, data, options)
	}

	methodFunc.deferred = <
		ThisArg,
		Delay extends number = number,
		GlobalUrl extends PostArgs[0] | undefined = undefined,
		GlobalData extends PostArgs[1] | undefined = undefined,
		// Conditionally define the arguments for the returned function
		CbArgs extends unknown[] = PostDeferredCbArgs<
			GlobalUrl,
			GlobalData,
			true // true: deny callback overriding 'method' in options
		>,
	>(
		...args: Parameters<
			typeof postDeferred<ThisArg, Delay, GlobalUrl, GlobalData, CbArgs>
		>
	) => {
		args[3] ??= {}
		args[3].method = method
		return postDeferred(...args)
	}

	return methodFunc
}
export default createPostMethodFunc
