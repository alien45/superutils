import { isObj } from './is'

/** Created a new object from source with sorted keys */
export const objSort = <T = unknown>(obj: T): T =>
	!isObj(obj)
		? obj
		: (Object.fromEntries(
				Object.keys(obj)
					.sort()
					.map(key => [key, obj[key as keyof typeof obj]]),
			) as T)
export default objSort
