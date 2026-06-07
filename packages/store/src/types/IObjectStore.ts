import { TypedMap } from '@superutils/core'
import { IStore } from './IStore'
import { Store_Options, Store_Parse, Store_Stringify } from './types'

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

/**
 * Defines the shape of the context object that can be attached to {@link IObjectStore} instance.
 *
 * A context can be:
 * - A plain object containing utility methods or properties.
 * - A factory function that receives the {@link IObjectStore} instance and returns an object.
 *   This is useful for creating methods that need to interact with the store's data
 *   using the store instance itself.
 *
 * @template Key - The type of keys in the store.
 * @template Value - The type of values in the store.
 * @template CacheDisabled - Whether caching is disabled for this store.
 */
export type ObjectStore_Context<
	T extends object,
	CacheDisabled extends boolean = false,
> = object | ((store: IObjectStore<T, CacheDisabled>) => object)



export type ObjectStore_Options<
	T extends object,
	CacheDisabled extends boolean,
	Context extends ObjectStore_Context<T, CacheDisabled>,
> = Omit<Store_Options<keyof T, T[keyof T], CacheDisabled>, 'initialValue'> & {
	context?: Context
	initialValue?: T
}
