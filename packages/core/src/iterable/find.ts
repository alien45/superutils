import { isFn } from '../is'
import filter from './filter'
import search from './search'
import { IterableList, type FindOptions } from './types'

/**
 * Finds a first item matching criteria in an {@link IterableList}.
 *
 * @returns first item matched or `undefined` if not found
 *
 * @example Find item using callback
 * ```typescript
 * import { find } from '@superutils/core'
 *
 * const map = new Map<number, { name: string; age: number }>([
 * 	[1, { name: 'Alice', age: 30 }],
 * 	[2, { name: 'Bob', age: 25 }],
 * 	[3, { name: 'Charlie', age: 35 }],
 * ])
 * const result = mapFind(testMap, ({ name }) => name === 'Bob')
 * // result: { name: 'Bob', age: 25 }
 * ```
 *
 * @example Find item using search options
 * ```typescript
 * import { find } from '@superutils/core'
 *
 * const map = new Map<number, { name: string; age: number }>([
 * 	[1, { name: 'Alice', age: 30 }],
 * 	[2, { name: 'Bob', age: 25 }],
 * 	[3, { name: 'Charlie', age: 35 }],
 * ])
 *	const result = mapFind(testmap, {
 *		query: 'Bob',
 *		key: 'name',
 *	})
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
	callback: Parameters<typeof filter<K, V>>[1],
): Return
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
