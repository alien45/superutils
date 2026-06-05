import { objToMap, isObj } from '@superutils/core'
import createStore, { Store_ContextReturn, Store_Context } from './createStore'
import Store from './Store'
import { Store_Options, IObjectStore } from './types'

/**
 * Defines the shape of the context object that can be attached to {@link IObjectStore} instance.
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
export type ObjectStore_Context<
	T extends object,
	CacheDisabled extends boolean = false,
> = object | ((store: IObjectStore<T, CacheDisabled>) => object)

/**
 * Creates a {@link Store} instance initialized from a plain object.
 *
 * This factory method automatically configures `parse` and `stringify` logic to
 * treat the underlying storage as a serialized object, while providing a
 * type-safe Map-like interface for individual properties.
 *
 * This default behavior can be overridden by providing custom `parse` and `stringify` implementations in `options`.
 *
 * @param name (optional) The name for the storage (e.g., localStorage key or filename).
 * @param options (optional) Configuration options for the storage instance.
 * @param options.initialValue (optional) An optional object to populate the storage if it's currently empty.
 *
 * @template T (optional) The structure of the object being stored. Can auto-infer from `options.initialValue`.
 * @template CacheDisabled (optional) Literal type determining whether to disable in-memory caching.
 *
 * @returns A new Store instance mapped to the object's keys and values.
 *
 * @example
 * #### Basic property-based access
 *
 * ```typescript
 * import { createObjectStore } from '@superutils/store'
 *
 * const storage = createObjectStore('user-profile', {
 *   initialValue: {
 *     age: 99,
 *     name: 'Ninety Nine'
 *   }
 * })
 *
 * // Keys are strictly inferred from the interface
 * const name = storage.get('name') // Type: string | undefined
 * console.log(name) // Prints: 'Ninety Nine'
 *
 * // Update properties with type safety
 * storage.set('age', 100) // Only numbers are accepted for 'age'
 *
 * // Export the underlying data back to a plain object
 * const userObj = storage.toObject<User>()
 * console.log(userObj) // { age: 100, name: 'Ninety Nine' }
 * ```
 *
 * @example
 * #### Usage with context
 *
 * ```javascript
 * import { createObjectStore } from '@superutils/store'
 *
 * // Functional context allows you to attach business logic directly to the store
 * const userStore = createObjectStore('user-profile', {
 *   initialValue: {
 *     age: 25,
 *     name: 'Jane Doe',
 *     roles: ['guest']
 *   },
 *   context: store => ({
 *     isAdmin: () => !!store.get('roles')?.includes('admin'),
 *     promoteToAdmin() {
 *       if (this.isAdmin()) return
 *
 *       // Use functional updates to safely modify the roles array
 *       store.set('roles', (prev = []) => [...prev, 'admin'])
 *     }
 *   })
 * })
 *
 * // Logic is encapsulated and easy to invoke
 * userStore.context.promoteToAdmin()
 * console.log(userStore.get('roles')) // ['guest', 'admin']
 * ```
 *
 */
export function createObjectStore<
	T extends object = Record<string, unknown>,
	Key extends keyof T = keyof T,
	Value extends T[Key] = T[Key],
	CacheDisabled extends boolean = false,
	Context extends ObjectStore_Context<T, CacheDisabled> = ObjectStore_Context<
		T,
		CacheDisabled
	>,
>(
	name?: string | null,
	options?: Omit<Store_Options<Key, Value, CacheDisabled>, 'initialValue'> & {
		context?: Context
		initialValue?: T
	},
): IObjectStore<T, CacheDisabled> & Store_ContextReturn<Context>

/**
 * Create a {@link Store} instance from an object using `options.initialValue`.
 */
export function createObjectStore<
	T extends object = Record<string, unknown>,
	Key extends keyof T = keyof T,
	Value extends T[Key] = T[Key],
	CacheDisabled extends boolean = false,
>(
	...args: ConstructorParameters<typeof Store<Key, Value, CacheDisabled>>
): IObjectStore<T, CacheDisabled>

export function createObjectStore<
	T extends object = Record<string, unknown>,
	Key extends keyof T = keyof T,
	Value extends T[Key] = T[Key],
	CacheDisabled extends boolean = false,
	Context extends Store_Context<Key, Value, CacheDisabled> = Store_Context<
		Key,
		Value,
		CacheDisabled
	>,
>(
	name?: string | null,
	options?: Omit<Store_Options<Key, Value, CacheDisabled>, 'initialValue'> & {
		context?: Context
		initialValue?: T
	},
) {
	const store = createStore(name, {
		parse: str => objToMap<T>(JSON.parse(str ?? '{}') as T),
		stringify: function (data) {
			return JSON.stringify(this.toObject(data))
		},
		...(options as Store_Options<Key, Value, CacheDisabled>),
		initialValue: !isObj(options?.initialValue, true)
			? options?.initialValue
			: objToMap<T>(options.initialValue),
	} as Parameters<typeof createStore<Context, Key, Value, CacheDisabled>>[1])

	store.type = 'object'

	return store
}

export default createObjectStore
