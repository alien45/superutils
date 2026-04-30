import { isObj } from '../is'
import { StrictMap } from './types'

/**
 * Converts an object into a Map with strong, heterogeneous typing.
 * Unlike a standard Map<string, Value>, the returned Map tracks the specific type
 * of each key-value pair based on the input object's structure.
 *
 * @param input - An object to convert. If null or not an object, an empty Map is returned.
 * @template T - The type of the input object.
 * @returns A Map (specifically a {@link StrictMap}) populated with the object's own enumerable string properties.
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
	Key extends keyof T & string,
	Value extends T[Key],
>(input: T) {
	const entries = Object.entries(!isObj(input) ? {} : input) as [Key, Value][]

	return new Map(entries.map(([k, v]) => [k, v])) as StrictMap<T>
}

/**
 * Converts an object into a Map of objects with strong, heterogeneous typing.
 * Each property value from the input object is wrapped in a new object using the specified `propertyName`.
 *
 * @param input - The object to convert.
 * @param propertyName - The name of the property to wrap values in. Defaults to 'value'.
 * @template T - The type of the input object.
 * @returns a map of objects with strict typing
 *
 * @example
 * #### Convert an object to a map of objects and places individual values a predefined property
 * This can be useful when storing to databases such as CouchDB enforces value to be an object.
 * ```typescript
 * import { objToMapOfObj } from '@superutils/core'
 *
 * const obj = {
 * 	a: 1,
 * 	b: false,
 * 	c: 'c',
 * }
 *
 * const map = objToMapOfObj(obj, 'value')
 * const x = map.get('a') // type: { value: number } | undefined
 * console.log(x) // Prints: { value: 1 }
 * ```
 */
export function objToMapOfObj<
	T extends object,
	PropertyName extends string = 'value',
	Key extends keyof T = keyof T,
	Value extends Record<PropertyName, T[Key]> = Record<PropertyName, T[Key]>,
>(input: T, propertyName: PropertyName = 'value' as PropertyName) {
	const entries = Object.entries(!isObj(input) ? {} : input) as [Key, Value][]

	return new Map(
		entries.map(([key, v]) => [key, { [propertyName as keyof Value]: v }]),
	) as StrictMap<Record<Key, Value>>
}
export default objToMap
