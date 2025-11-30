import { FetchOptions, FetchOptionsInterceptor } from './types'
import config from './config'
import { isEmpty, objKeys } from '@superutils/core'

/**
 * Merge one or more {@link FetchOptions} with global fetch options ({@link config.fetchOptions}).
 *
 * Notes:
 * - {@link config.fetchOptions} will be added as the base and not necessary to be included
 * - item properties will be prioritized in the order of sequence they were passed in
 * - the following properties will be merged
 *     * `errMsgs`
 *     * `headers`
 *     * `interceptors`
 * - all other properties will simply override previous values
 *
 * @returns combined
 */
export const mergeFetchOptions = (...allOptions: FetchOptions[]) =>
	allOptions.reduce((o1, o2) => {
		const { errMsgs = {}, headers, interceptors: ints1 = {} } = o1
		const { errMsgs: msgs2 = {}, interceptors: ints2 = {} } = o2
		o2.headers
			&& new Headers(o2.headers).forEach((value, key) =>
				(headers as Headers).set(key, value),
			)
		for (const key of objKeys(msgs2)) {
			// prevent `undefined | null` msg overriding previous msg
			if (!isEmpty(msgs2[key])) continue
			errMsgs[key] = msgs2[key]
		}
		return {
			...o1,
			...o2,
			errMsgs,
			headers,
			interceptors: {
				error: ints1?.error?.concat(ints2?.error ?? []) ?? [],
				request: ints1?.request?.concat(ints2?.request ?? []) ?? [],
				response: ints1?.response?.concat(ints2?.response ?? []) ?? [],
				result: ints1?.result?.concat(ints2?.result ?? []) ?? [],
			},
			timeout: o2.timeout ?? o1.timeout ?? 0,
		}
	}, config.fetchOptions) as FetchOptionsInterceptor
export default mergeFetchOptions
