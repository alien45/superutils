import { isObj } from '../is'
import objKeys from './objKeys'

/**
 * Create a new object with properties sorted by key
 *
 * @example
 * #### Sort an object recursively
 *
 * ```javascript
 * import { objSort } from '@superutils/core'
 *
 * const d = Symbol('d')
 * const obj = { c: 3, a: 1, [d]: 4, b: 2, e: { g: 1, f: 2 } }
 * console.log(objSort(obj))
 * // Result:
 * // {
 * //     a: 1,
 * //     b: 2,
 * //     c: 3,
 * //     [d]: 4,
 * //     e: { f: 2, g: 1 },
 * // }
 * ```
 */
export const objSort = <T>(
	obj: T,
	recursive = true,
	_done = new Map<unknown, boolean>(),
) => {
	const sorted = {} as T
	if (!isObj(obj)) return sorted

	for (const key of objKeys(obj) as (keyof T)[]) {
		const value = obj[key]
		// prevent circular operations
		_done.set(value, true)
		sorted[key] =
			!recursive || !isObj(value)
				? value
				: (objSort(
						value as Record<PropertyKey, unknown>,
						recursive,
						_done,
					) as T[keyof T])
	}
	return sorted
}
export default objSort
