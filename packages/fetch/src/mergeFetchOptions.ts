import { isEmpty, isObj, objKeys } from '@superutils/core'
import { FetchOptions, FetchOptionsInterceptor } from './types'

/**
 * Merge one or more {@link FetchOptions}
 *
 * Notes:
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
		(merged, next) => {
			next = isObj(next) ? next : {}
			const { errMsgs = {}, headers, interceptors: ints1 = {} } = merged
			const { errMsgs: msgs2 = {}, interceptors: ints2 = {} } = next
			next.headers
				&& new Headers(next.headers).forEach((value, key) => {
					headers && (headers as Headers).set(key, value)
				})
			for (const key of objKeys(msgs2)) {
				// prevent `undefined | null` msg overriding previous msg
				if (!isEmpty(msgs2[key])) errMsgs[key] = msgs2[key]
			}
			return {
				...merged,
				...next,
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
				timeout: next.timeout ?? merged.timeout,
			}
		},
		{ headers: new Headers() },
	) as FetchOptionsInterceptor
export default mergeFetchOptions

/** Merges partial fetch options ignoring empty or undefined. Otherwise, will return the first argument. */
export const mergePartialOptions = (
	...optionsAr: (Partial<FetchOptions> | undefined)[]
) => {
	optionsAr = optionsAr.filter(x => !isEmpty(x))

	return optionsAr.length <= 1
		? optionsAr[0]
		: mergeFetchOptions(...(optionsAr as Partial<FetchOptions>[]))
}
