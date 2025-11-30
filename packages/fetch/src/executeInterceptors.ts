import { fallbackIfFails, isFn } from '@superutils/core'
import { type Interceptor } from './types'

/** Gracefully execute interceptors and return un-/modified value */
export const executeInterceptors = async <
	T,
	TArgs extends unknown[],
	TArgs2 extends unknown[] = [value: T, ...TArgs],
>(
	value: T,
	interceptors: Interceptor<T, TArgs, TArgs2>[],
	...args: TArgs
) => {
	for (const interceptor of interceptors.filter(isFn)) {
		value =
			((await fallbackIfFails(
				interceptor,
				[value, args],
				undefined,
			)) as T) ?? value // if throws error or undefined is returned
	}
	return value
}

export default executeInterceptors
