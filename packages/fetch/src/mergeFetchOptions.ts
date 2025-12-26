import { FetchOptions, FetchOptionsInterceptor } from './types'
import { isEmpty, objKeys } from '@superutils/core'

/**
 * Merge one or more {@link FetchOptions}
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
	allOptions.reduce(
		(o1, o2) => {
			const { errMsgs = {}, headers, interceptors: ints1 = {} } = o1
			const { errMsgs: msgs2 = {}, interceptors: ints2 = {} } = o2
			o2.headers
				&& new Headers(o2.headers).forEach((value, key) => {
					headers && (headers as Headers).set(key, value)
				})
			for (const key of objKeys(msgs2)) {
				// prevent `undefined | null` msg overriding previous msg
				if (!isEmpty(msgs2[key])) errMsgs[key] = msgs2[key]
			}
			return {
				...o1,
				...o2,
				errMsgs,
				headers,
				interceptors: {
					error: [...(ints1?.error ?? []), ...(ints2?.error ?? [])],
					request: [
						...(ints1?.request ?? []),
						...(ints2?.request ?? []),
					],
					response: [
						...(ints1?.response ?? []),
						...(ints2?.response ?? []),
					],
					result: [
						...(ints1?.result ?? []),
						...(ints2?.result ?? []),
					],
				},
				timeout: o2.timeout ?? o1.timeout ?? 0,
			}
		},
		{ headers: new Headers() },
	) as FetchOptionsInterceptor
export default mergeFetchOptions
