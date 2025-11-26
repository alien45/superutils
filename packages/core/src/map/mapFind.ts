import { isFn } from '../is/'
import { mapSearch, type SearchOptions } from '../iterable'
import { mapFilter } from './mapFilter'

export type FindOptions<K, V, IncludeKey extends boolean = false> = Omit<
	SearchOptions<K, V>,
	'limit' | 'asMap'
> & {
	/**
	 * Whether to include the key in the return type.
	 *
	 * If `true`, return type is `[K, V]` else `V`
	 *
	 * Default: `false`
	 */
	includeKey?: IncludeKey
}
/**
 * @name	mapFind
 * @summary finds a specific object by supplied object property/key and value within.
 *
 * @returns first item matched or `undefined` if not found
 *
 * @example Find item using callback
 * ```typescript
 * import { mapFindByKey } from '@superutils/core'
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
 * import { mapFindByKey } from '@superutils/core'
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
export function mapFind<
	K,
	V extends Record<string, unknown>,
	IncludeKey extends boolean = false,
	Return = undefined | (IncludeKey extends true ? [K, V] : V),
>(data: Map<K, V>, callback: Parameters<typeof mapFilter<V, K>>[1]): Return
export function mapFind<
	K,
	V extends Record<string, unknown>,
	IncludeKey extends boolean = false,
	Return = undefined | (IncludeKey extends true ? [K, V] : V),
>(data: Map<K, V>, options: FindOptions<K, V, IncludeKey>): Return
export function mapFind<
	K,
	V extends Record<string, unknown>,
	IncludeKey extends boolean = false,
	Result = undefined | (IncludeKey extends true ? [K, V] : V),
>(
	data: Map<K, V>,
	optsOrCb:
		| ((value: V, key: K, map: Map<K, V>) => boolean)
		| FindOptions<K, V, IncludeKey>,
): Result {
	const result = isFn(optsOrCb)
		? mapFilter(data, optsOrCb, 1)
		: mapSearch(data, { ...optsOrCb, asMap: true, limit: 1 })

	return result[
		(optsOrCb as Record<string, unknown>)?.includeKey
			? 'entries' // returns: [key, value]
			: 'values' // returns: value
	]().next().value as Result
}
