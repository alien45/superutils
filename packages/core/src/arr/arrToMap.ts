import { isArr, isDefined, isFn, isObj } from '../is'

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
export const arrToMap = <
	T extends unknown[],
	GetKeyFn extends (
		item: MapItem,
		index: number,
		flatArr: MapItem[],
		arr: T,
	) => unknown,
	FlatDepth extends number = 0,
	MapItem = FlatArray<T, FlatDepth>,
	ParamKey =
		| undefined
		| GetKeyFn
		| (MapItem extends Record<infer K, unknown> ? MapItem[K] : unknown),
	MapKey = ParamKey extends undefined
		? number
		: ParamKey extends (...args: Parameters<GetKeyFn>) => infer Ret
			? Ret
			: ParamKey,
>(
	arr: T,
	flatDepth: FlatDepth = 0 as FlatDepth,
	key?: ParamKey,
) =>
	new Map(
		(isArr(arr) ? arr : [])
			.flat(flatDepth)
			.filter(Boolean)
			.map((item, i, arrFlat) => [
				(isFn(key)
					? key(item as MapItem, i, arrFlat, arr)
					: isObj(item) && isDefined(key) && !isFn(key)
						? (item as Record<PropertyKey, unknown>)[
								key as PropertyKey
							]
						: i) ?? i,
				item,
			]),
	) as Map<MapKey, MapItem>
export default arrToMap
