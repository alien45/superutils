import { isObj } from '../is'
import { mapSearch, type SearchConfig } from '../map'

export const arrSearch = <
	V extends Record<string, unknown>,
	AsMap extends boolean = false,
	Result = AsMap extends true ? Map<number, V> : V[],
>(
	arr: V[],
	config: SearchConfig<number, V, AsMap>,
): Result => mapSearch(arr, { asMap: false, ...(isObj(config) && config) })
