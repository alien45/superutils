import { arrUnique, asAny, forceCast } from '@utiils/core'
import config from './config'
import { FetchArgsInterceptor, FetchOptions } from './types'

export const mergeFetchOptions = (...allOptions: FetchOptions[]) => {
	const mergedOptions = allOptions.reduce(
		(merged, next) => ({ ...merged, ...next }),
		{},
	)
	const global = config.defaults.fetchOptions
	const keys = Object.keys(global)
	keys.forEach(key => (asAny(mergedOptions)[key] ??= asAny(global)[key]))

	const headers = new Headers(global.headers)
	allOptions.map(x =>
		new Headers(x.headers || []).forEach((value, name) =>
			headers.set(name, value),
		),
	)
	allOptions.unshift(global)
	return {
		...mergedOptions,
		errMsgs: allOptions.reduce(
			(merged, next) => ({ ...merged, ...next.errMsgs }),
			{},
		),
		headers,
		interceptors: ['error', 'request', 'response', 'result'].reduce(
			(obj, key) => ({
				...obj,
				[key]: allOptions
					.map(options => (options.interceptors as any)?.[key] || [])
					.flat(1),
			}),
			{},
		),
	} as FetchArgsInterceptor[1]
}
export default mergeFetchOptions
