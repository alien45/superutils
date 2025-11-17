import { asAny } from '../forceCast'
import { isDefined, isFn, isObj } from '../is'

/**
 * @name	arrToMap
 * @summary generate a Map from one or more arrays
 *
 * @param arr
 * @param key (optional) Array object-item property name or a function to generate keys for each array items.
 *
 * @returns map
 */
export const arrToMap = <
	T,
	Item extends FlatArray<T[], FlatDepth>,
	FlatDepth extends number = 0,
	ParamKey =
		| ((item: Item, index: number, arr: T[]) => any)
		| (Item extends Record<infer K, any> ? K : undefined),
	Key = ParamKey extends (...args: any[]) => any
		? ReturnType<ParamKey>
		: ParamKey extends keyof Item
			? Item[ParamKey]
			: number,
>(
	arr: T[],
	key?: ParamKey,
	flatDepth: FlatDepth = 0 as FlatDepth,
) =>
	new Map(
		(arr || [])
			.flat(flatDepth)
			.filter(Boolean)
			.map((item, i) => [
				(isFn(key)
					? key(item as Item, i, arr)
					: isObj(item) && isDefined(key)
						? asAny(item)[key]
						: i) ?? i,
				item,
			]),
	) as Map<Key, Item>
export default arrToMap
