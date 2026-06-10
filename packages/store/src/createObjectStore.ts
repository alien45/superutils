import { objToMap, isObj, isMap } from '@superutils/core'
import createStore from './createStore'
import type {
	IObjectStore,
	ObjectStore_Context,
	ObjectStore_Options,
	Store_ContextOmitProps,
	ObjectStore_ContextValidated,
} from './types'

/**
 * Creates a {@link IObjectStore} instance initialized from a plain object.
 *
 * This factory method automatically configures `parse` and `stringify` logic to
 * treat the underlying storage as a serialized object, while providing a
 * type-safe Map-like interface for individual properties.
 *
 * This default behavior can be overridden by providing custom `parse` and `stringify` implementations in `options`.
 *
 * @param options (optional) Configuration options for the storage instance. See {@link ObjectStore_Options} for more.
 * @param options.initialValue (optional) An optional object to populate the storage if it's currently empty.
 * @param options.name (optional) locaStorage key (or JSON filename in NodeJS) for persistence storage.
 * @param context - (optional) A plain object or a factory function that returns an object.
 *
 * **Purpose:**
 * Use `context` to encapsulate domain-specific business logic, helper methods, or non-reactive state
 * directly into the store instance.
 *
 * **Behavior:** See {@link createStore}.
 *
 * @template T (optional) The structure of the object being stored. Can auto-infer from `options.initialValue`.
 * @template CacheDisabled - Whether store data caching is disabled.
 * @template Context - The type of the context object or factory function.
 *
 * @returns A new Store instance mapped to the object's keys and values.
 *
 * @example
 * #### Basic property-based access
 *
 * ```javascript
 * import { createObjectStore } from '@superutils/store'
 *
 * const userStore = createObjectStore('user', {
 *   initialValue: {
 *     age: 99,
 *     name: 'Ninety Nine'
 *   }
 * })
 *
 * // Keys are strictly inferred from the interface
 * const name = userStore.get('name') // Type: string | undefined
 * console.log(name) // Prints: 'Ninety Nine'
 *
 * // Update properties with type safety
 * userStore.set('age', 100) // Only numbers are accepted for 'age'
 *
 * // Export the underlying data back to a plain object
 * const user = userStore.toObject()
 * console.log(user) // { age: 100, name: 'Ninety Nine' }
 * ```
 *
 * @example
 * #### Usage with context
 *
 * ```javascript
 * import { createObjectStore } from '@superutils/store'
 *
 * const getContext = store => ({
 *     isAdmin: () => !!store.get('roles')?.includes('admin'),
 *     promoteToAdmin() {
 *       if (this.isAdmin()) return
 *
 *       // Use functional updates to safely modify the roles array
 *       store.set('roles', (prev = []) => [...prev, 'admin'])
 *     }
 *   }
 * // Functional context allows you to attach business logic directly to the store
 * const userStore = createObjectStore(
 *   'user',
 *   {
 *     initialValue: {
 *       age: 25,
 *       name: 'Jane Doe',
 *       roles: ['guest']
 *     },
 *   },
 *   getContext
 * )
 *
 * // Logic is encapsulated and easy to invoke
 * userStore.promoteToAdmin()
 * console.log(userStore.get('roles')) // ['guest', 'admin']
 * ```
 *
 */
export function createObjectStore<
	T extends object = Record<string, unknown>,
	CacheDisabled extends boolean = false,
	Context extends ObjectStore_Context<T, CacheDisabled> = ObjectStore_Context<
		T,
		CacheDisabled
	>,
>(
	options?: null | ObjectStore_Options<T, CacheDisabled>,
	context?: Context & ObjectStore_ContextValidated<Context, T, CacheDisabled>,
) {
	options = {
		// only required for persistent store
		...(options?.name && {
			parse: str => objToMap(JSON.parse(str ?? '{}') as T),
			stringify(data) {
				return JSON.stringify(this.toObject(data))
			},
		}),
		...options,
		initialValue: !isObj(options?.initialValue, true)
			? options?.initialValue
			: objToMap(options.initialValue),
	} as ObjectStore_Options<T, CacheDisabled>

	const store = createStore(
		...([options, context] as unknown as Parameters<typeof createStore>),
	) as unknown as IObjectStore<T, CacheDisabled>
		& Store_ContextOmitProps<Context>

	store.type = 'object'

	const setAll = store.setAll.bind(store)
	store.setAll = (obj, replace) => {
		if (obj && !isMap(obj)) obj = objToMap(obj)

		return setAll(obj, replace)
	}

	store.toMap = data => (!data ? store.getAll() : objToMap(data))

	return store
}
export default createObjectStore
