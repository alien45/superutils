export * from './config'
export * from './fetch'
export * from './fetchDeferred'
export * from './postDeferred'
export * from './mergeFetchOptions'
export * from './post'
export * from './types'
import _fetch from './fetch'
import fetchDeferred from './fetchDeferred'
import _post from './post'
import postDeferred from './postDeferred'
import { FetchDeferredArgs, FetchOptions } from './types'

export type Func = <T, Options extends Omit<FetchOptions, 'method'>>(
	url: string | URL,
	options?: Options,
) => ReturnType<typeof _fetch<T, Options>>
export type MethodFunc = Func
	& ({ deferred: typeof fetchDeferred } | { deferred: typeof postDeferred })

export type FetchDeferred = typeof fetchDeferred | typeof postDeferred

export interface DefaultFetch extends Record<string, MethodFunc> {
	<T, O extends FetchOptions>(
		...params: Parameters<typeof _fetch<T, O>>
	): ReturnType<typeof _fetch<T, O>>
}

const fetchGet = (method = 'get') => {
	const methodFunc = (<T>(
		url: string | URL,
		options: Omit<FetchOptions, 'method'> = {},
	) => {
		;(options as FetchOptions).method = method
		return _fetch<T>(url, options)
	}) as MethodFunc
	methodFunc.deferred = <ThisArg, DefaultUrl extends string | URL>(
		...args: Parameters<typeof fetchDeferred<ThisArg, DefaultUrl>>
	) => fetchDeferred(...args)

	return methodFunc
}
const fetchPost = (method = 'post') => {
	const methodFunc = ((
		url: string | URL,
		options: Omit<FetchOptions, 'method'> = {},
	) => {
		;(options as FetchOptions).method = method
		return _post(url, options)
	}) as MethodFunc
	methodFunc.deferred = <ThisArg, DefaultUrl extends string | URL>(
		...args: Parameters<typeof postDeferred<ThisArg, DefaultUrl>>
	) => postDeferred(...args)

	return methodFunc
}
export const fetch = _fetch as DefaultFetch

// methods that does not allow/use `options.body`: get | head | options
fetch.get = fetchGet('get')
fetch.head = fetchGet('head')
fetch.delete = fetchGet('options')
// methods that allows `options.body`: post | put | patch | delete
fetch.delete = fetchPost('delete')
fetch.patch = fetchPost('patch')
fetch.post = fetchPost('post')
fetch.put = fetchPost('put')
export default fetch
