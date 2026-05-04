import { isObj } from '../is'
import { TypedMap } from '../map/types'

/**
 * Converts an object into a Map with strong, heterogeneous typing.
 * Unlike a standard Map<string, Value>, the returned Map tracks the specific type
 * of each key-value pair based on the input object's structure.
 *
 * @param input - An object to convert. If null or not an object, an empty Map is returned.
 * @template T - The type of the input object.
 * @returns A Map (specifically a {@link TypedMap}) populated with the object's own enumerable string properties.
 *
 * @example
 * #### Convert an object to a map
 * ```typescript
 * import { objToMap } from '@superutils/core'
 *
 * const obj = {
 * 	a: 1,
 * 	b: false,
 * 	c: 'c',
 * }
 *
 * const map = objToMap(obj)
 * const x = map.get('a') // TypeScript knows this is: number | undefined
 * console.log(x) // Prints: 1
 *
 * const y = map.get('b') // TypeScript knows this is: boolean | undefined
 * console.log(y) // Prints: false
 * ```
 */
export function objToMap<
	T extends object,
	Key extends keyof T = keyof T,
	Value extends T[Key] = T[Key],
>(input: T) {
	const entries = Object.entries(!isObj(input) ? {} : input) as [Key, Value][]

	return new Map(entries.map(([k, v]) => [k, v])) as TypedMap<T>
}
export default objToMap
