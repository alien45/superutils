import { isFn, isObj } from '@superutils/core'
import Store from './Store'
import { IStore, Store_Options } from './types'
import {
	IStoreWithContext,
	Store_Context,
	Store_ContextReturn,
} from './types/context'

/**
 * Factory function to create a {@link Store} instance with optional context.
 *
 * This function provides a convenient way to instantiate a store and attach supplemental
 * logic (context) to it. It supports full type inference for both the store's data
 * and the attached context.
 *
 * @param name - The name of the storage (e.g., localStorage key). If null/undefined, the store remains in-memory.
 * @param options - Configuration options for the store
 * @param options.context - (optional) A plain object or a factory function that returns an object.
 *
 * **Purpose:**
 * Use `context` to encapsulate domain-specific business logic, helper methods, or non-reactive state
 * directly alongside the store instance.
 *
 * **Behavior:**
 * - **Non-Reactive:** Updates to context properties do **not** trigger `onChange` or RxJS emissions.
 * - **Non-Persistent:** Context data is purely in-memory and is **not** saved to persistent storage.
 * - **Access to Store:** When a factory function is used, it receives the store instance as an argument.
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
 * #### In-memory store
 * ```javascript
 * import fetch from '@superutils/fetch'
 * import { createStore } from '@superutils/store'
 *
 * const store = createStore({
 *   context: store => ({
 *     async getProducts() {
 *       const { products } = await fetch.get('https://dummyjson.com/products')
 *
 *       const productsMap = new Map(products.map(p => [p.id, p]))
 *       store.setAll(productsMap)
 *
 *       return productsMap
 *     },
 *   }),
 * })
 *
 * store.context.getProducts().then(() => {
 *   console.log(store.getAll())
 * })
 * ```
 *
 * @example
 * #### Store with a functional context (access to store instance)
 * ```javascript
 * import { createStore } from '@superutils/store'
 *
 * const authStore = createStore('auth', {
 *   context: store => ({
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
): IStoreWithContext<Key, Value, CacheDisabled, Context>

export function createStore<
	Context extends Store_Context<Key, Value, CacheDisabled>,
	Key,
	Value,
	CacheDisabled extends boolean = false,
>(
	options: Store_Options<Key, Value, CacheDisabled> & { context?: Context },
): IStoreWithContext<Key, Value, CacheDisabled, Context>

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
	name?:
		| string
		| null
		| (Store_Options<Key, Value, CacheDisabled> & { context?: Context }),
	options?: Store_Options<Key, Value, CacheDisabled> & { context?: Context },
) {
	if (isObj(name)) {
		options = name
		name = null
	}

	const store = new Store(name, options)

	Object.defineProperty(store, 'context', {
		configurable: false,
		enumerable: false,
		value: isFn(options?.context)
			? options.context(store)
			: options?.context,
		writable: false,
	})

	return store as typeof store & Store_ContextReturn<Context>
}
export default createStore
