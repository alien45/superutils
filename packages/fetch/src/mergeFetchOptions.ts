import { asAny } from '@superutils/core'
import { FetchArgsInterceptor, FetchInterceptors, FetchOptions } from './types'
import config from './config'

/** Merge one or more fetch options with global fetch options */
export const mergeFetchOptions = (...allOptions: FetchOptions[]) => {
	const mergedOptions = allOptions.reduce(
		(merged, next) => ({ ...merged, ...next }),
		{},
	)
	const global = config.fetchOptions
	const keys = Object.keys(global)
	keys.forEach(key => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		asAny(mergedOptions)[key] ??= asAny(global)[key]
	})

	const headers = new Headers(global.headers)
	allOptions.map(x =>
		new Headers(x.headers ?? []).forEach((value, name) =>
			headers.set(name, value),
		),
	)
	allOptions.unshift(global)
	const interceptorKeys = ['error', 'request', 'response', 'result']
	return {
		...mergedOptions,
		errMsgs: allOptions.reduce(
			(merged, next) => ({ ...merged, ...next.errMsgs }),
			{},
		),
		headers,
		interceptors: interceptorKeys.reduce(
			(obj, key) => ({
				...obj,
				[key]: allOptions
					.map(
						options =>
							options.interceptors?.[
								key as keyof FetchInterceptors
							] ?? [],
					)
					.flat(1),
			}),
			{},
		),
	} as FetchArgsInterceptor[1]
}
export default mergeFetchOptions
