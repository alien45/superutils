import fallbackIfFails from '../fallbackIfFails'
import { isEmpty, isFn, isObj } from '../is'
import { IterableList } from './types'

export type SliceMapCallback<Data, Value, Key> = (
	item: Value,
	key: Key,
	data: Data,
) => Value

export type SliceMapOptions<Data, Value, Key, AsMap extends boolean = false> = {
	/** Whether to return the result as a Map (preserving original keys) or an Array */
	asMap?: AsMap
	/** callback to transform each item */
	transform?: SliceMapCallback<Data, Value, Key>
	/** End index (exclusive). Default: `undefined` (end of the list) */
	end?: number
	/** Whether to exclude item if value is `undefined | null` */
	ignoreEmpty?: boolean
	/** Start index. Default: `0` */
	start?: number
}
/**
 * Slice an iterable list and map the values into an Array/Map
 *
 * @param data		Array, Map, Set...
 * @param start		Default: `0`
 * @param end		(optional) last index - exclusive. Default: index of the last item
 * @param callback	to be executed on each item within the set range.
 *
 * If callback throws error or returnes `undefined`, the item will be ignored.
 *
 * Callback Params:
 *   - item: current item
 *   - key: index/key of the current item
 *   - data: original list
 *
 * @returns Array/Map
 */
export const sliceMap = <
	Data extends IterableList,
	Key = Data extends IterableList<infer Key, unknown> ? Key : never,
	Value = Data extends IterableList<unknown, infer Value> ? Value : never,
	AsMap extends boolean = false,
	// Result = AsMap extends false ? Value : Map<KV[0], Value>,
>(
	data: Data,
	options?:
		| SliceMapOptions<Data, Value, Key, AsMap>
		| SliceMapCallback<Data, Value, Key>,
) => {
	const {
		asMap = false as AsMap,
		end,
		start = 0,
		transform,
		ignoreEmpty = true,
	} = isFn(options) ? { transform: options } : isObj(options) ? options : {}

	const result = new Map()
	const subset = [...(data?.entries?.() || [])].slice(start, end)
	for (const [_, [key, value]] of subset.entries()) {
		if (ignoreEmpty && isEmpty(value)) continue
		const newValue = fallbackIfFails(
			transform ?? value,
			[value, key, data],
			undefined,
		)

		// ignore if callback execution failed
		newValue !== undefined && result.set(key, newValue as Value)
	}
	return (asMap ? result : [...result.values()]) as AsMap extends false
		? Value[]
		: Map<Key, Value>
}
export default sliceMap
