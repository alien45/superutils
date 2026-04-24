import { isSubjectLike as _isSubjectLike } from '@superutils/core'
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
): x is SubjectLike<T> => _isSubjectLike(x, withValue)

export default isSubjectLike
