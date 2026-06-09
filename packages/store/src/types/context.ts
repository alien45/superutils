import { IObjectStore } from './IObjectStore'
import { IStore, Store_Options } from './IStore'

export type DenyStoreProps<Context> = {
	[K in keyof Context]: K extends ReservedProps ? never : Context[K]
}
/**
 * Utility type to exclude starndard store interface and options properties from context
 */
export type OmitStoreProps<T> = T extends object
	? // eslint-disable-next-line @typescript-eslint/no-explicit-any
		Omit<T extends (...args: any[]) => infer R ? R : T, ReservedProps>
	: never

/** All property names that should not be in context */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type ReservedProps =
	| keyof IStore<any, any, any>
	| keyof Store_Options<any, any, any>

export type ValidatedContext<
	Context,
	Key,
	Value,
	CacheDisabled extends boolean = false,
> = Context extends (...args: any[]) => infer R
	? (store: IStore<Key, Value, CacheDisabled>) => DenyStoreProps<R>
	: DenyStoreProps<Context>

export type ValidatedObjectContext<
	Context,
	T extends object,
	CacheDisabled extends boolean = false,
> = Context extends (...args: any[]) => infer R
	? (store: IObjectStore<T, CacheDisabled>) => DenyStoreProps<R>
	: DenyStoreProps<Context>

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
	| object
	| undefined
	| ((store: IStore<Key, Value, CacheDisabled>) => object)

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
export type ObjectStore_Context<
	T extends object,
	CacheDisabled extends boolean = false,
> = object | undefined | ((store: IObjectStore<T, CacheDisabled>) => object)
