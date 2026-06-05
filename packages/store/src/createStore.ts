import { isFn } from '@superutils/core'
import Store from './Store'
import { IStore, Store_Options } from './types'

/**
 * Defines the shape of the context object that can be attached to a {@link Store}.
 *
 * A context can be:
 * - A plain object containing utility methods or properties.
 * - A factory function that receives the {@link Store} instance and returns an object.
 *   This is useful for creating methods that need to interact with the store's data
 *   using the store instance itself.
 *
 * @template Key - The type of keys in the store.
 * @template Value - The type of values in the store.
 * @template CacheDisabled - Whether caching is disabled for this store.
 */
export type Store_Context<Key, Value, CacheDisabled extends boolean = false> =
	| object
	| ((store: IStore<Key, Value, CacheDisabled>) => object)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReturnTypeOrSelf<T> = T extends (...args: any[]) => infer R ? R : T

/**
 * Factory function to create a {@link Store} instance with optional context.
 *
 * This function provides a convenient way to instantiate a store and attach supplemental
 * logic (context) to it. It supports full type inference for both the store's data
 * and the attached context.
 *
 * @param name - The name of the storage (e.g., localStorage key). If null/undefined, the store remains in-memory.
 * @param options - Configuration options for the store, including the optional `context`.
 *
 * @template Context - The type of the context object or factory function.
 * @template Key - The type of keys stored in the map.
 * @template Value - The type of values stored in the map.
 * @template CacheDisabled - Literal type determining whether to disable in-memory caching.
 *
 * @returns A {@link Store} instance augmented with a `context` property.
 *
 * @example
 * #### Basic store without context
 * ```javascript
 * import { createStore } from '@superutils/store'
 *
 * const store = createStore<string, number>()
 * store.set('count', 1)
 * store.set('count', prevCount => prevCount + 1)
 * ```
 *
 * @example
 * #### Store with a static context object
 * ```javascript
 * import { createStore } from '@superutils/store'
 *
 * const store = createStore('user-settings', {
 *   context: {
 *     count: 0,
 *     log(msg) {
 *         console.log(`[${++this.count}] ${msg}`)
 *     }
 *   }
 * })
 *
 * store.context.log('Setting updated')
 * console.log(store.context.count)
 * ```
 *
 * @example
 * #### Store with a functional context (access to store instance)
 * ```typescript
 * import { createStore } from '@superutils/store'
 *
 * const authStore = createStore('auth', {
 *   context: (store) => ({
 *     isAuthenticated: () => store.has('token'),
 *     logout: () => store.delete('token')
 *   })
 * })
 *
 * if (authStore.context.isAuthenticated()) {
 *   authStore.context.logout()
 * }
 * ```
 */
export function createStore<
	Context extends Store_Context<Key, Value, CacheDisabled>,
	Key,
	Value,
	CacheDisabled extends boolean = false,
>(
	name?: ConstructorParameters<typeof Store<Key, Value, CacheDisabled>>[0],
	options?: Store_Options<Key, Value, CacheDisabled> & { context?: Context },
): IStore<Key, Value, CacheDisabled> & {
	context: ReturnTypeOrSelf<Context>
}

/**
 * Factory method to create a {@link Store} instance.
 *
 * @param args - Arguments passed directly to the {@link Store} constructor.
 * @template Key - The type of keys stored in the map.
 * @template Value - The type of values stored in the map.
 * @template CacheDisabled - Whether to disable in-memory caching.
 */
export function createStore<Key, Value, CacheDisabled extends boolean = false>(
	...args: ConstructorParameters<typeof Store<Key, Value, CacheDisabled>>
): Store<Key, Value, CacheDisabled>

export function createStore<
	Context extends Store_Context<Key, Value, CacheDisabled>,
	Key,
	Value,
	CacheDisabled extends boolean,
>(
	name?: ConstructorParameters<typeof Store<Key, Value, CacheDisabled>>[0],
	options?: Store_Options<Key, Value, CacheDisabled> & { context?: Context },
) {
	const store = new Store(name, options)

	Object.defineProperty(store, 'context', {
		configurable: false,
		enumerable: false,
		value: isFn(options?.context)
			? options.context(store)
			: options?.context,
		writable: false,
	})

	return store as typeof store & {
		context: ReturnTypeOrSelf<Context>
	}
}
export default createStore
