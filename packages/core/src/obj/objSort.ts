import { isObj } from '../is'
import objKeys from './objKeys'

/** create a new object with properties sorted by key */
export const objSort = <T extends Record<PropertyKey, unknown>>(
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
