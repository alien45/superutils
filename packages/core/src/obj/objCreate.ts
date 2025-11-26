import { asAny } from '../forceCast'
import { isArr, isObj } from '../is'

/**
 * @name	objCreate
 * @summary constructs a new object with supplied key(s) and value(s)
 *
 * @param	{Array}	keys
 * @param	{Array}		values	(optional)
 * @param	{Object}		result	(optional)
 *
 *
 * @returns	created and/or merged
 */
export const objCreate = <
	V,
	K extends PropertyKey,
	RV,
	RK extends PropertyKey,
	Result extends Record<K | RK, V | RV>,
>(
	keys: K[] = [],
	values: V[] = [],
	result?: Result,
) => {
	if (!isObj(result)) result = {} as Result
	for (let i = 0; i < (isArr(keys) ? keys : []).length; i++) {
		asAny<Record<PropertyKey, unknown>>(result)[keys[i]] = values?.[i]
	}
	return result
}
