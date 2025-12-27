import { fallbackIfFails, isFn } from '@superutils/core'
import { type Interceptor } from './types'

/**
 * Gracefully execute interceptors and return un-/modified value
 *
 * @param	value value to be passed to the interceptor. Eg: (Response, result... when using `fetch()`)
 * @param	interceprors interceptor functions
 * @param	args (optional) arguments to be supplied to the interceptor in addition to the `value' which
 * will always be the first argument.
 */
export const executeInterceptors = async <T, TArgs extends unknown[]>(
	value: T,
	interceptors: Interceptor<T, TArgs>[],
	...args: TArgs
) => {
	for (const interceptor of interceptors.filter(isFn)) {
		value =
			((await fallbackIfFails(
				interceptor,
				[value, ...args],
				undefined,
			)) as T) ?? value // if throws error or undefined is returned
	}
	return value
}

export default executeInterceptors
