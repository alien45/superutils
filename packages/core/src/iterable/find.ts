import { isFn } from '../is'
import filter from './filter'
import search from './search'
import { IterableList, type FindOptions } from './types'

/**
 * Finds a first item using predicate in an iterable list (Array, Map or Set).
 *
 * @returns first item matched or `undefined` if not found
 *
 * @example
 * #### Find item using predicate callback
 *
 * ```typescript
 * import { find } from '@superutils/core'
 *
 * const map = new Map<number, { name: string; age: number }>([
 * 	[1, { name: 'Alice', age: 30 }],
 * 	[2, { name: 'Bob', age: 25 }],
 * 	[3, { name: 'Charlie', age: 35 }],
 * ])
 * const result = find(map, ({ name }) => name === 'Bob')
 * console.log({ result })
 * // result: { name: 'Bob', age: 25 }
 * ```
 */
export function find<
	K,
	V extends Record<string, unknown>,
	IncludeKey extends boolean = false,
	Return = undefined | (IncludeKey extends true ? [K, V] : V),
>(
	data: IterableList<K, V>,
	predicate: Parameters<typeof filter<K, V>>[1],
): Return
/**
 * Find the first item in an iterable list (Array, Map or Set) using `search()` function
 *
 * @param data items to search
 * @param options filter options. See {@link FindOptions}
 *
 * @example
 * #### Find item using search options
 *
 * ```typescript
 * import { find } from '@superutils/core'
 *
 * const map = new Map<number, { name: string; age: number }>([
 * 	[1, { name: 'Alice', age: 30 }],
 * 	[2, { name: 'Bob', age: 25 }],
 * 	[3, { name: 'Charlie', age: 35 }],
 * ])
 *	const result = find(map, {
 *		query: { name: 'Bob' }
 *	})
 * console.log({ result })
 * // result: { name: 'Bob', age: 25 }
 * ```
 */
export function find<
	K,
	V extends Record<string, unknown>,
	IncludeKey extends boolean = false,
	Return = undefined | (IncludeKey extends true ? [K, V] : V),
>(data: IterableList<K, V>, options: FindOptions<K, V, IncludeKey>): Return
export function find<
	K,
	V extends Record<string, unknown>,
	IncludeKey extends boolean = false,
	Result = undefined | (IncludeKey extends true ? [K, V] : V),
>(
	data: IterableList<K, V>,
	optsOrCb:
		| ((value: V, key: K, data: IterableList<K, V>) => boolean)
		| FindOptions<K, V, IncludeKey>,
): Result {
	const result = isFn(optsOrCb)
		? filter(data, optsOrCb, 1)
		: search(data, { ...optsOrCb, asMap: true, limit: 1 })

	return result[
		(optsOrCb as Record<string, unknown>)?.includeKey
			? 'entries' // returns: [key, value]
			: 'values' // returns: value
	]().next().value as Result
}

export default find
