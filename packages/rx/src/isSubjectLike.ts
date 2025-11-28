import { isFn, isObj } from '@superutils/core'
import { SubjectLike } from './types'

/**
 * Check if value is similar to a RxJS subject with .subscribe & .next functions
 *
 * @param x The value to check
 * @param withValue When `true`, also checks if `value` property exists in `x`
 *
 * @returns `true` if the value is subject-like, `false` otherwise.
 */
export const isSubjectLike = <T>(
	x: unknown,
	withValue = false,
): x is SubjectLike<T> =>
	isObj<SubjectLike<T>>(x, false)
	&& isFn(x.subscribe)
	&& isFn(x.next)
	&& (!withValue || 'value' in x)
