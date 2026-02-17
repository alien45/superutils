import { isArr, isFn, isObj, objCopy } from '@superutils/core'
import { FetchOptions, FetchOptionsInterceptor } from './types'

/**
 * Merge one or more {@link FetchOptions}
 *
 * Notes:
 * - item properties will be prioritized in the order of sequence they were passed in
 * - the following properties will be merged:
 *   * `errMsgs`
 *   * `headers`
 *   * `interceptors`
 * - all other properties will simply override previous values
 *
 * @returns combined
 */
export const mergeOptions = (...allOptions: (FetchOptions | undefined)[]) =>
	allOptions.reduce(
		(merged: FetchOptions, options) => {
			options = isObj(options) ? options : {}
			const { headers, interceptors: ints1 = {} } = merged
			const { interceptors: ints2 = {} } = options
			options.headers
				&& new Headers(options.headers).forEach((value, key) =>
					(headers as Headers).set(key, value),
				)

			return {
				...merged,
				...options,
				errMsgs: objCopy(
					options.errMsgs as Record<string, string>,
					merged.errMsgs,
					[],
					'empty',
				),
				headers,
				interceptors: {
					error: [...toArr(ints1?.error), ...toArr(ints2?.error)],
					request: [
						...toArr(ints1?.request),
						...toArr(ints2?.request),
					],
					response: [
						...toArr(ints1?.response),
						...toArr(ints2?.response),
					],
					result: [...toArr(ints1?.result), ...toArr(ints2?.result)],
				},
				timeout: options.timeout ?? merged.timeout,
			} as FetchOptions
		},
		{ headers: new Headers() },
	) as FetchOptionsInterceptor
export default mergeOptions

const toArr = <T = unknown>(x?: T | T[]) => (isArr(x) ? x : isFn(x) ? [x] : [])
