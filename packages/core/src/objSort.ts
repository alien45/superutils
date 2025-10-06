import { asAny } from './forceCast'
import { isObj } from './is'

/** Created a new object from source with sorted keys */
export const objSort = <T = any>(obj: T): T =>
	!isObj(obj)
		? obj
		: (Object.fromEntries(
				Object.keys(obj)
					.sort()
					.map(key => [key, asAny(obj)[key]]),
			) as T)
export default objSort
