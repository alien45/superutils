import { IObjectStore } from './IObjectStore'
import { IStore } from './IStore'

/**
 * Defines the shape of the context object that can be attached to a {@link Store}.
 *
 * A context can be:
 * - A plain object containing utility methods or properties.
 * - A factory function that receives the {@link IStore} instance and returns an object.
 *   This is useful for creating methods that need to interact with the store's data
 *   using the store instance itself.
 *
 * @template Key - The type of keys in the store.
 * @template Value - The type of values in the store.
 * @template CacheDisabled - Whether caching is disabled for this store.
 */
export type Store_Context<Key, Value, CacheDisabled extends boolean = false> =
	| undefined
	| object
	| ((store: IStore<Key, Value, CacheDisabled>) => object)

export type Store_ContextReturn<T> = {
	context: undefined extends T
		? never
		: // eslint-disable-next-line @typescript-eslint/no-explicit-any
			T extends (...args: any[]) => infer R
			? R
			: T
}

export type IStoreWithContext<
	Key,
	Value,
	CacheDisabled extends boolean,
	Context extends Store_Context<Key, Value, CacheDisabled>,
> = IStore<Key, Value, CacheDisabled> & Store_ContextReturn<Context>

export type IObjectStoreWithContext<
	T extends object,
	CacheDisabled extends boolean,
	Context extends Store_Context<keyof T, T[keyof T], CacheDisabled>,
> = IObjectStore<T, CacheDisabled> & Store_ContextReturn<Context>
