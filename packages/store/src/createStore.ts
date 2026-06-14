import { isFn, isObj } from '@superutils/core'
import Store from './Store'
import type {
	Store_Options,
	ContextValidate,
	IStore,
	ContextReturn,
} from './types'

const isStoreKey = <S extends object>(store: S, key: unknown) =>
	OPTIONAL_STORE_PROPS.includes(key as (typeof OPTIONAL_STORE_PROPS)[number])
	|| store[key as keyof S] !== undefined

/**
 * Store property names that are optional/user-provided and should not be allowed in context.
 *
 * This is used to avoid optional store properties being overriden by context properties
 */
export const OPTIONAL_STORE_PROPS = [
	'delayOptions',
	'name',
	'onChange',
	'onError',
	'parse',
	'spaces',
	'storage',
	'stringify',
	'validate',
] as const

/**
 * Factory function to create a {@link Store} instance with optional business logic augmented into the store instance.
 *
 * This function provides a convenient way to instantiate a store and attach supplemental
 * logic (context) to it. It supports full type inference for both the store's data
 * and the attached context.
 *
 * @param options - (optional) Configuration options for the store.
 * @param context - (optional) A plain object or a factory function that returns an object.
 * If function provided, it is executed only once during instantiation.
 *
 * **Purpose:**
 * Use `context` to encapsulate domain-specific business logic, helper methods, or non-reactive state
 * directly into the store instance.
 *
 * **Behavior:**
 * - **Non-Reactive:** Updates to context properties do **not** trigger `onChange` or RxJS emissions.
 * - **Non-Persistent:** Context data is purely in-memory and is **not** saved to persistent storage.
 * - **Access to Store:** When a factory function is used, it receives the store instance as an argument.
 * - **Notes**:
 *   - Built-in store properties are not allowed
 *   - Augmented methods' "thisArg" will be the context as per default JavaScript behavior.
 *   - Custom class instances are supported as context. Built-in {@link Store} properties take precedence
 * in the event of a naming conflict.
 *
 * @template Key - The type of keys stored in the map.
 * @template Value - The type of values stored in the map.
 * @template CacheDisabled - Whether store data caching is disabled.
 * @template Context - The type of the context object or factory function.
 *
 * @returns A {@link Store} instance with augmented properties (if any).
 *
 * @example
 * #### Basic usage
 * ```javascript
 * import { createStore } from '@superutils/store'
 *
 * const store = createStore({ initialValue: new Map([['count', 0]])})
 * store.set('count', 1)
 * store.set('count', prevCount => prevCount + 1)
 * console.log(store.get('count')) // 2
 * ```
 *
 * @example
 * #### Store augmented with custom business logic
 * ```javascript
 * import { createStore } from '@superutils/store'
 *
 * const store = createStore({ name: 'user-settings'}, {
 *   count: 0,
 *   log(msg) {
 *     console.log(`[${++this.count}] ${msg}`)
 *   }
 * })
 *
 * store.log('Settings updated')
 * console.log(store.count)
 * ```
 *
 * @example
 * #### In-memory store
 * ```javascript
 * import fetch from '@superutils/fetch'
 * import { createStore } from '@superutils/store'
 *
 * // Bypass the name property to create an in-memory store
 * const store = createStore()
 *
 * // This will NOT save the data to localStorage
 * store.set('key', 'value')
 * ```
 *
 * @example
 * #### Store with a functional context
 * ```javascript
 * import { createStore } from '@superutils/store'
 *
 * const authStore = createStore(null, store => ({
 *   isAuthenticated: () => store.has('token'),
 *   logout: () => {
 *     store.delete('token')
 *     console.log('logged out')
 *   }
 * }))
 *
 * if (authStore.isAuthenticated()) {
 *   authStore.logout()
 * }
 * ```
 *
 * @example
 * #### Augmenting with a custom class instance
 *
 * ```typescript
 * import { createStore } from '@superutils/store'
 *
 * class MyCustomClass {
 *   private _count = 0
 *   get count() {
 *     return this._count
 *   }
 *   increment = () => this._count++
 *   decrement() {
 *     return --this._count
 *   }
 * }
 *
 * const store = createStore(null, new MyCustomClass())
 * console.log(
 *   store.count,     // 0
 *   store.increment(),// function
 *   store.count,	 // 1
 *   store.decrement(), // undefined
 * )
 *```
 */
export function createStore<
	Context extends
		| object
		| ((store: IStore<Key, Value, CacheDisabled>) => object),
	Key,
	Value,
	CacheDisabled extends boolean,
>(
	options: undefined | null | Store_Options<Key, Value, CacheDisabled>,
	context: Context
		& ContextValidate<Context, IStore<Key, Value, CacheDisabled>>,
): IStore<Key, Value, CacheDisabled> & ContextReturn<Context>

// without context
export function createStore<Key, Value, CacheDisabled extends boolean = false>(
	options?: Store_Options<Key, Value, CacheDisabled>,
): IStore<Key, Value, CacheDisabled>

export function createStore<Context, Key, Value, CacheDisabled extends boolean>(
	options?: null | Store_Options<Key, Value, CacheDisabled>,
	context?: Context,
) {
	const store = new Store(options?.name, options)
	const _context = isFn(context) ? (context(store) as object) : context

	if (!isObj(_context, false)) return store

	return new Proxy(store, {
		get: (store, key, receiver) =>
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			Reflect.get(
				isStoreKey(store, key) ? store : _context,
				key,
				receiver,
			),
		set: (store, key, value, receiver) =>
			Reflect.set(
				isStoreKey(store, key) ? store : _context,
				key,
				value,
				receiver,
			),
	})
}
export default createStore
