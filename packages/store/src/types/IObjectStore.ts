import { TypedMap } from '@superutils/core'
import { IStore } from './IStore'
import { Store_Parse, Store_Stringify } from './types'

// @ts-expect-error force override properties while preserving documentation of IStore
export interface IObjectStore<
	T extends object,
	CacheDisabled extends boolean = false,
	ObjectMap extends TypedMap<T> = TypedMap<T>,
> extends IStore<keyof T, T[keyof T], CacheDisabled> {
	/**
	 * Default: `object`
	 */
	type: string

	get<Key extends keyof T>(key: Key): T[Key] | undefined

	getAll(forceRead?: boolean): TypedMap<T>

	parse?: Store_Parse<ObjectMap, IObjectStore<T, CacheDisabled>>

	set<Key extends keyof T, Value extends T[Key]>(
		key: Key,
		value: Value | ((currentValue?: Value) => Value),
	): IObjectStore<T, CacheDisabled>

	setAll(data?: ObjectMap, replace?: boolean): IObjectStore<T, CacheDisabled>

	stringify?: Store_Stringify<ObjectMap, IObjectStore<T, CacheDisabled>>

	toObject<O extends object = T>(data?: Map<keyof T, T[keyof T]>): O
}
