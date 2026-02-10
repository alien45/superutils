import fallbackIfFails from '../fallbackIfFails'
import { isEmpty, isFn, isObj } from '../is'
import { IterableList } from './types'

export type SliceMapTransform<Data, Value, Key> = (
	item: Value,
	key: Key,
	data: Data,
) => Value

export type SliceMapOptions<Data, Value, Key, AsMap extends boolean = false> = {
	/** Whether to return the result as a Map (preserving original keys) or an Array */
	asMap?: AsMap
	/** Callback to transform each item from the selected range */
	transform?: SliceMapTransform<Data, Value, Key>
	/** End index (exclusive). Default: `undefined` (end of the list) */
	end?: number
	/** Whether to exclude item if value is `undefined | null` */
	ignoreEmpty?: boolean
	/** Start index. Default: `0` */
	start?: number
}

/**
 * Slice an iterable list and map the values into an Array/Map.
 *
 * @param data		Array, Map, Set...
 * @param options	One of the following is required to create a new list:
 * 1. A callback function {@link SliceMapTransform} to transform all items.
 * 2. Advanced options {@link SliceMapOptions}.
 * @param options.asMap	(optional) whether return a Map or Array.
 * @param options.end	(optional) End index (exclusive). Default: `undefined` (end of the list)
 * @param options.ignoreEmpty (optional) Whether to exclude item if value is `undefined | null`
 * @param options.start	(optional) Default: `0`
 * @param options.transform	(optional)
 *
 * If callback throws error or returnes `undefined`, the item will be ignored.
 *
 * Callback Params:
 *   - item: current item
 *   - key: index/key of the current item
 *   - data: original list
 *
 * @returns Array/Map depending on `options.asMap`
 *
 * @example
 * #### Slice a list of items and map values into new array
 * ```javascript
 * import { sliceMap } from '@superutils/core'
 *
 * const data = new Map([
 * 	[0, { age: 30, name: 'Alice' }],
 * 	[1, { age: 25, name: 'Bob' }],
 * 	[2, undefined],
 * 	[3, {}],
 * 	[4, { age: 35, name: 'Charlie' }],
 * 	[5, { age: 28, name: 'Dave' }],
 * 	[6, { age: 22, name: 'Eve' }],
 * ])
 * const result = sliceMap(data, {
 * 	asMap: false, // whether to return the result as a Map
 * 	end: 5, // last index (exclusive)
 * 	ignoreEmpty: true, // ignore items with no value
 * 	start: 1, // first index
 * })
 * console.log(result)
 * // [ { age: 25, name: 'Bob' }, { age: 35, name: 'Charlie' } ]
 * ```
 */
export const sliceMap = <
	Data extends IterableList,
	Key = Data extends IterableList<infer Key, unknown> ? Key : never,
	Value = Data extends IterableList<unknown, infer Value> ? Value : never,
	AsMap extends boolean = false,
	Result = AsMap extends false ? Value[] : Map<Key, Value>,
>(
	data: Data,
	options?:
		| SliceMapOptions<Data, Value, Key, AsMap>
		| SliceMapTransform<Data, Value, Key>,
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
	return (asMap ? result : [...result.values()]) as Result
}
export default sliceMap
