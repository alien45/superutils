import { isArr, isObj } from '../is'

/**
 * Creates an object from an array of keys and a corresponding array of values.
 * It pairs each key with the value at the same index.
 *
 * @param keys An array of property keys (strings or symbols).
 * @param values (optional) An array of property values. The value at each index corresponds to the key at the same index. If a value is missing for a key, it will be `undefined`.
 * @param result (optional) An existing object to add or overwrite properties on. If not provided, a new object is created.
 * @returns The newly created object, or the `result` object merged with the new properties.
 *
 * @example
 * #### Creating a new object from arrays of keys and values
 * ```javascript
 * import { objCreate } from '@superutils/core'
 *
 * const keys = ['a', 'b', 'c']
 * const values = [1, 2, 3]
 * const newObj = objCreate(keys, values)
 * console.log(newObj)
 * // newObj is { a: 1, b: 2, c: 3 }
 * ```
 *
 * @example
 * #### Merging into an existing object
 * ```typescript
 * import { objCreate } from '@superutils/core'
 *
 * const existingObj = { a: 0, d: 4 }
 * const keys = ['b', 'c']
 * const values = [2, 3]
 * const newObj = objCreate(keys, values, existingObj)
 * console.log(newObj)
 * // existingObj is now { a: 0, d: 4, b: 2, c: 3 }
 * ```
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
		;(result as Record<PropertyKey, unknown>)[keys[i]] = values?.[i]
	}
	return result
}
