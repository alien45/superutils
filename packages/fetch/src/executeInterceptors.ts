import { fallbackIfFails, isFn } from '@superutils/core'
import { type Interceptor } from './types'

/**
 * Gracefully executes interceptors and returns the processed value.
 * If the value is not transformed (by returning a new value) by the interceptors,
 * the original value is returned.
 *
 * @param	value value to be passed to the interceptors
 * @param	interceptors interceptor callbacks
 * @param	args (optional) common arguments to be supplied to all the interceptors in addition to
 * the `value' which will always be the first argument.
 *
 * Interceptor arguments: `[value, ...args]`
 */
export const executeInterceptors = async <T, TArgs extends unknown[]>(
	value: T,
	interceptors?: Interceptor<T, TArgs>[],
	...args: TArgs
) => {
	for (const interceptor of [...(interceptors ?? [])].filter(isFn)) {
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
