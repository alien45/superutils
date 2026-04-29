import { isObj } from '../is'

/**
 * Converts an object into a Map with strong, heterogeneous typing.
 *
 * @param input
 * @param asObject (optional) if true will convert individual values into objects. See example for more details.
 *
 * Default: `false`
 *
 * @returns converted map
 *
 * @example
 * #### Convert an object to a map
 * ```typescript
 * const obj = {
 * 	a: 1,
 * 	b: false,
 * 	c: 'c',
 * }
 *
 * const map = objToMap(obj)
 * const x = map.get('a') // type: number | undefined
 * console.log(x) // Prints: 1
 * ```
 *
 * @example
 * #### Convert an object to a map of objects with "value" as object key
 * ```typescript
 * const obj = {
 * 	a: 1,
 * 	b: false,
 * 	c: 'c',
 * }
 *
 * const map = objToMap(obj)
 * const x = map.get('a') // type: { value: number } | undefined
 * console.log(x) // Prints: { value: 1 }
 * ```
 */
export function objToMap<
	T extends object,
	Key extends keyof T & string,
	Value extends T[Key],
	AsObj extends boolean = false,
	const Value2 = AsObj extends true ? { value: Value } : Value,
>(input: T, asObject = false as AsObj) {
	if (!isObj(input)) return new Map<Key, Value2>()

	const mapper = asObject
		? ([k, v]: [Key, Value]) => [k, { value: v }] as [Key, Value2]
		: ([k, v]: [Key, Value]) => [k, v] as unknown as [Key, Value2]

	return new Map(
		(Object.entries(input) as [Key, Value][]).map(mapper),
	) as Omit<Map<Key, Value2>, 'get' | 'set'> & {
		get<K extends Key>(
			key: K,
		): (AsObj extends true ? { value: T[K] } : T[K]) | undefined

		set<K extends Key>(key: K, value: T[K]): Map<Key, Value2>
	}
}

export default objToMap
