import { IObjectStore } from './IObjectStore'
import { IStore, Store_Options } from './IStore'

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
 * @template CD - Whether store data caching is disabled.
 */
export type Store_Context<Key, Value, CD extends boolean = false> =
	| object
	| undefined
	| ((store: IStore<Key, Value, CD>) => object)

export type Store_ContextValidate<Context> = Context extends object
	? {
			/** Utility to deny store props in context */
			[K in keyof Context]: K extends Store_ReservedProps
				? never
				: Context[K]
		}
	: never
/**
 * Utility type to exclude starndard store interface and options properties from context
 */
export type Store_ContextOmitProps<Context> = Omit<
	Context extends (store: IStore) => infer R ? R : Context,
	Store_ReservedProps
>

export type Store_ContextValidated<
	Context,
	Key,
	Value,
	CD extends boolean = false,
> = Context extends (store: IStore) => infer R
	? (store: IStore<Key, Value, CD>) => Store_ContextValidate<R>
	: Store_ContextValidate<Context>

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
 * @template CD - Whether store data caching.
 */
export type ObjectStore_Context<T extends object, CD extends boolean = false> =
	| object
	| undefined
	| ((store: IObjectStore<T, CD>) => object)

export type ObjectStore_ContextValidated<
	Context,
	T extends object,
	CD extends boolean = false,
> = Context extends (store: IObjectStore) => infer R
	? (store: IObjectStore<T, CD>) => Store_ContextValidate<R>
	: Store_ContextValidate<Context>

/** All property names that should not be in context */
export type Store_ReservedProps = keyof IStore | keyof Store_Options
