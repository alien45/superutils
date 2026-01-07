import { isArr, isDefined, isFn, isNumber, isObj } from '../is'

/**
 * Generate a Map from one or more arrays
 *
 * @param arr
 * @param key (optional) Array object-item property name or a function to generate keys for each array items.
 * @param flatDepth (optional) maximum recursion depth to flatten the array. Default: `0`
 *
 * @returns Converted Map
 *
 * @example Convert Array to Map
 * ```typescript
 * type Item = { a: number }
 * const arr: Item[] = [{ a: 1 }, { a: 2 }, { a: 3 }, [{ a: 4 }]]
 * const map: Map<number, Item> = arrToMap(
 * 	   arr,
 * 	   (_: Item, i: number) => item.a,
 * )
 * ```
 *
 * @example Flatten and convert Array to Map
 * ```typescript
 * type Item = { key: number; value: string }
 * const arr: (Item | Item[])[] = [
 * 	{ key: 1, value: 'a' },
 * 	{ key: 2, value: 'b' },
 * 	{ key: 3, value: 'c' },
 * 	[{ key: 4, value: 'd' }],
 * ]
 * const map = arrToMap(arr, (item: Item) => item.key, 1) // Map<number, Item>
 * ```
 */

export function arrToMap<
	T extends unknown[],
	FlatDepth extends number = 0,
	MapItem = FlatArray<T, FlatDepth>,
	KeyProp extends keyof MapItem = keyof MapItem,
>(arr: T, key: KeyProp, flatDepth?: FlatDepth): Map<MapItem[KeyProp], MapItem>

// Overload for when no key is provided. The map keys will be array indices (number).
export function arrToMap<T extends unknown[], FlatDepth extends number = 0>(
	arr: T,
	flatDepth?: FlatDepth,
): Map<number, FlatArray<T, FlatDepth>>

// Overload for when a key function is provided.
export function arrToMap<
	T extends unknown[],
	FlatDepth extends number = 0,
	MapItem = FlatArray<T, FlatDepth>,
	MapKey = unknown,
>(
	arr: T,
	key: (item: MapItem, index: number, flatArr: MapItem[]) => MapKey,
	flatDepth?: FlatDepth,
): Map<MapKey, MapItem>

// Implementation
export function arrToMap<T extends unknown[]>(
	arr: T,
	key?: unknown,
	flatDepth = 0,
): Map<unknown, unknown> {
	;[key, flatDepth] = isNumber(key) ? [undefined, key] : [key, flatDepth]

	const flatEntries = (
		!isArr(arr)
			? [] // invalid arr
			: flatDepth > 0 // flattening required
				? arr.flat(flatDepth)
				: arr
	).map((item, i, flatArr) => [
		(isFn(key)
			? key(item, i, flatArr)
			: isObj(item) && isDefined(key)
				? item[key as keyof typeof item]
				: i) ?? i,
		item,
	]) as [unknown, unknown][]

	return new Map(flatEntries)
}
export default arrToMap
