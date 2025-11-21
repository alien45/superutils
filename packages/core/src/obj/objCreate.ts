// import { isArr, isObj } from '../is'
// import { RecordKey } from '../types'

// /**
//  * @name	objCreate
//  * @summary constructs a new object with supplied key(s) and value(s)
//  *
//  * @param	{Array}	keys
//  * @param	{Array}		values	(optional)
//  * @param	{Object}		result	(optional)
//  *
//  *
//  * @returns	{Object}
//  */
// export const objCreate = (keys: RecordKey[] = [], values = [], result = {}) => {
// 	if (!isArr(keys) || !isArr(values) || !isObj(result)) return {}
// 	for (let i = 0; i < keys.length; i++) {
// 		const key = keys[i]
// 		const value = values[i]
// 		result[key] = value
// 	}
// 	return result
// }
