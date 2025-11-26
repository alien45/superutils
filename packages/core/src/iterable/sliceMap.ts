import fallbackIfFails from '../fallbackIfFails'
import { isDefined, isNumber } from '../is'
import { IterableList } from '.'

/**
 * Slice an iterable list (Array, Map, Set...) and map the values into an Array/Map
 *
 * @param data
 * @param first  Default: `0`
 * @param last	last index - inclusive. Default: index of the last item
 * @param callback to be executed on each item within the set range.
 *
 * If callback throws error or returnes `undefined`, the item will be ignored.
 *
 * Callback Params:
 *   - item: current item
 *   - key: index/key of the current item
 *   - data: original list
 *
 * @returns Array of values
 */
export const sliceMap = <
	Key,
	Value,
	Data extends IterableList<Key, Value>,
	AsMap extends boolean = false,
	Result = AsMap extends false ? Value[] : Map<Key, Value>,
>(
	data: Data,
	first = 0,
	last: number,
	callback?: (item: Value, key: Key, data: Data) => Value,
	/** Whether to exclude item if value is `undefined | null` */
	ignoreUndefined = true,
	/* Whether to return the result as a Map (preserving original keys) or an Array */
	asMap = false as AsMap,
) => {
	const len =
		('size' in data && data?.size) || ('length' in data && data.length) || 0
	if (!len || !isNumber(len)) return [] as Result

	// make sure index is 0 or higher
	first = first >= 0 && first < len ? first : 0
	// make sure end is not higher than last index
	last = last >= first && last < len ? last : len - 1
	const result = new Map<Key, Value>()
	const subset = [...data.entries()].slice(first, last)
	for (const [_, [key, value]] of subset.entries()) {
		if (ignoreUndefined && isDefined(value)) continue
		const newValue = fallbackIfFails(
			callback ?? value,
			[value, key, data],
			undefined,
		)

		// ignore if callback execution failed
		newValue !== undefined && result.set(key, newValue as Value)
	}
	return (asMap ? result : [...result.values()]) as Result
}
export default sliceMap
