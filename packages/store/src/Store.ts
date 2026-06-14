import {
	deferred,
	type EntryComparator,
	fallbackIfFails,
	filter,
	find,
	getEntries,
	getKeys,
	getValues,
	isArr,
	isArr2D,
	isDefined,
	isFn,
	isMap,
	isPositiveNumber,
	isStr,
	mapJoin,
	search,
	sort,
} from '@superutils/core'
import { BehaviorSubject, skip, Subject, Subscription } from 'rxjs'
import { type IStore, Store_OnErrorType, type Store_Options } from './types'

/**
 * RxJS Subject to trigger forced update of cached data from underlying storage of {@link Store} instances.
 *
 * Accepted values:
 * - `string`: Updates the cache for the instance with the matching name.
 * - `string[]`: Updates the cache for all instances whose names are included in the array.
 * - `true`: Triggers a global cache update for all instances that have a `name` defined.
 * - `false`: No-op.
 *
 * @example
 * ```javascript
 * import { Store, forceUpdateCache$ } from '@superutils/store'
 *
 * const names = ['products', 'users']
 *
 * // Update all Store instances by a list of their names
 * forceUpdateCache$.next(names)
 * // alternatively: Store.forceUpdateCache(names)
 *
 * // Update all Store instances with a specific name
 * forceUpdateCache$.next(names[0])
 * // alternatively: Store.forceUpdateCache(names[0])
 *
 * // Update every single instance of Store that uses storage (has a "name" property)
 * forceUpdateCache$(true)
 * // alternatively: Store.forceUpdateCache(true)
 * ```
 *
 * @example
 *
 * #### Practical example
 * ```typescript
 * import { createStore, forceUpdateCache$ } from '@superutils/store'
 *
 * const name = 'user-profile'
 * const delay = 0 // delay is set to zero to simplify the example
 *
 * const userStore = createStore(name, { delay })
 * const userStore2 = createStore(name, { delay })
 *
 * userStore.init()
 * userStore2.init()
 *
 * userStore.set('name', 'John Doe')
 * console.log(userStore2.get('name')) // Prints: undefined
 *
 * forceUpdateCache$.next(name)
 * console.log(userStore2.get('name')) // Prints: 'John Doe'
 * ```
 */
export const forceUpdateCache$ = new Subject<string | string[] | boolean>()

/**
 * A generic, reactive data storage class that provides a Map-like interface with advanced features
 * such as search, filtering, and sorting. Supports both in-memory caching and persistent storage
 * (LocalStorage in browsers, JSON files in NodeJS via `node-localstorage` NPM module).
 *
 * #### Notes:
 * - **Performance**: `Store` is optimized for small to medium datasets.
 *   - For datasets > 1MB, consider increasing the `delay` option to reduce write frequency.
 *   - It is **NOT** recommended for datasets larger than 3MB due to synchronous serialization costs.
 *   - For one-off operations or standalone scripts, data size is constrained only by available system memory
 *   and processing power.
 * - **RxJS Integration**: Built on RxJS for reactive data handling, though no prior RxJS knowledge is required.
 * - **Storage Behavior**:
 *   - If `name` is omitted, the instance operates in-memory only and data is not persisted to storage.
 *   - If `cacheDisabled` is `true`, data is not kept in memory; every read/write operation accesses the underlying
 * storage directly.
 *
 * @template Key The type of keys stored in the map.
 * @template Value The type of values stored in the map.
 * @template CacheDisabled A literal boolean type indicating whether in-memory caching is disabled.
 * @template This A self-referential interface type extending {@link IStore} used for accurate
 *   method signature inference and type-safe property access. This allows method implementations to
 *   reference their return types and other method signatures through the interface definition.
 *
 * @see {@link forceUpdateCache$} for cache invalidation across instances.
 *
 * @example
 * #### Browser Usage 1: use like a map
 * ```javascript
 * import { Store } from '@superutils/store'
 *
 * const userStore = new Store('users')
 * userStore.set(1, { name: 'Alice', age: 30 })
 * const user = userStore.get(1)
 * console.log(user) // prints: {name: 'Alice', age: 30}
 * ```
 *
 * @example
 * #### Browser Usage 2:
 * ```javascript
 * import { Store } from '@superutils/store'
 * import fetch from '@superutils/fetch'
 *
 * const { products } = await fetch.get('[DUMMYJSON-DOT-COM]/products')
 * const storage = new Store('products', {
 *   initialValue: new Map(products.map(p => [p.id, p])) // convert to Map
 * })
 *
 * // print product with id `1`
 * console.log(storage.get(1))
 *
 * // search for items
 * const searchResult = storage.search({
 *   query: { availabilityStatus: 'low' }
 * })
 * console.log(searchResult)
 * ```
 * @example
 * #### NodeJS Usage
 * ```javascript
 * import { Store } from '@superutils/store'
 * import fetch from '@superutils/fetch'
 * import { LocalStorage } from 'node-localstorage'
 *
 * // Add localStorage alternative for NodeJS that reads and writes to JSON files.
 * // This is not necessary for browsers.
 * globalThis.localStorage = new LocalStorage('./data', 1e7)
 *
 * const storage = new Store('products')
 * const { products } = await fetch.get('[DUMMYJSON-DOT-COM]/products')
 * // save all items to storage
 * storage.setAll(
 *   new Map(products.map(p => [p.id, p])), // convert to Map
 * )
 *
 * // print product with id `1`
 * console.log(storage.get(1))
 *
 * // search for items
 * const searchResult = storage.search({
 *   query: { availabilityStatus: 'low' }
 * })
 * console.log(searchResult)
 * ```
 *
 * @example
 * #### Advanced: `onChange` and RxJS subject
 *
 * Internally, `Store` uses RxJS subject which is exposed as `subject$` property.
 * You can use this to subscribe to changes and do additional operations such as logging or sanitization etc.
 *
 * Alternatively, you can also set the `onChange` callback which is triggered whenever the subject changes and
 * does not require maintaining a subscription or knowledge of RxJS subject.
 *
 * ```javascript
 * import { Store } from '@superutils/store'
 *
 * const storage = new Store('my-data')
 * const sub = storage.subject$.subscribe(data => {
 *   // Write to the database whenever data changes
 *   console.log('Saving to database...', data)
 * })
 * // unsubscribe from subject
 * setTimeout(()=> sub.unsubscribe(), 1000)
 *
 * // add an entry to storage
 * storage.set('bob', { age: 99, id: 'bob', name: 'Bob' })
 * ```
 */
export class Store<
	Key,
	Value,
	CacheDisabled extends boolean = false,
	/**
	 * @remarks
	 * **On the `This` template parameter:**
	 * Using `This` as a self-referential template is a **good practice** in this context because:
	 * - It provides accurate **type inference** for method return types that depend on the generic parameters.
	 * - It enables **type-safe property access** through `This['methodName']`, allowing the implementation
	 *   to reference interface contracts without circular dependencies or casting issues.
	 * - It allows **fluent API chains** (returning `this`) while maintaining proper generic type information.
	 * - It prevents **type widening** that would occur if methods returned the concrete class type instead
	 *   of the interface type, which is important for generic constraints and polymorphism.
	 *
	 * However, it increases **cognitive complexity** and is only warranted when:
	 * - The class implements a complex generic interface with interdependent type parameters.
	 * - Type-safe property references are essential to avoid runtime errors or casting.
	 * - Fluent interfaces or chaining is a core API feature.
	 */
	This extends IStore<Key, Value, CacheDisabled> = IStore<
		Key,
		Value,
		CacheDisabled
	>,
> implements IStore<Key, Value, CacheDisabled> {
	readonly cacheDisabled: This['cacheDisabled']

	readonly delay: This['delay']

	/** Debounce and throttle related options */
	readonly delayOptions?: This['delayOptions']

	readonly initialized: This['initialized'] = false

	readonly name: This['name']

	onChange?: This['onChange']

	onError?: This['onError']

	parse?: This['parse']

	get size() {
		return this.getAll().size
	}

	spaces?: This['spaces']

	readonly storage?: This['storage']

	stringify?: This['stringify']

	readonly subject$!: This['subject$']

	private subscriptions = {
		subject: undefined as Subscription | undefined,
		forceUpdateCache: undefined as Subscription | undefined,
	}

	type: This['type'] = 'map'

	validate?: This['validate']

	constructor(
		name?: This['name'],
		options?: Store_Options<Key, Value, CacheDisabled> | null,
	) {
		this.name = `${name ?? options?.name ?? ''}`.trim() || null
		const {
			cacheDisabled = false as CacheDisabled,
			delay,
			delayOptions,
			initialValue,
			onError,
			onChange,
			parse,
			spaces,
			storage = fallbackIfFails(
				() => (!this.name ? undefined : globalThis.localStorage),
				[],
				undefined,
			),
			stringify,
			validate = {},
		} = options ?? {}
		if (this.name && !storage && storage !== null)
			throw new Error(Store.messages.invalidStorageOptions)

		this.cacheDisabled = (!!storage && cacheDisabled) as CacheDisabled
		this.delay = delay === 0 || isPositiveNumber(delay) ? delay : 300
		this.delayOptions = delayOptions
		this.onError = onError
		this.onChange = onChange
		this.parse = parse?.bind(this)
		this.spaces = spaces
		this.storage = storage as This['storage']
		this.stringify = stringify?.bind(this)
		this.subject$ = (
			this.cacheDisabled ? new Subject() : new BehaviorSubject(new Map())
		) as This['subject$']

		const _validate = { ...validate } as Record<PropertyKey, unknown>
		for (const [key, value] of Object.entries(_validate)) {
			_validate[key] = value
		}
		this.validate = _validate

		// non-empty map provided - initiate the storage immediately
		isMap(initialValue)
			&& initialValue.size
			&& (this.init as (...args: unknown[]) => void)(initialValue, false)
	}

	clear: This['clear'] = () => {
		this.validate?.clear?.call(this, [], 'clear')
		return this.setAll(new Map<Key, Value>(), true)
	}

	delete: This['delete'] = keys => {
		if (!isArr(keys)) keys = [keys]

		this.validate?.delete?.call(this, [keys], 'delete')

		const data = this.getAll()
		for (const k of keys) data.delete(k)

		this.setAll(data, true)
		return this
	}

	static messages = Object.seal({
		invalidJsonEntries:
			'Invalid JSON format. Parsed value must be a 2D array representing key-value pairs.',
		invalidStorageOptions:
			'options.storage: LocalStorage instance or equivalent required. For NodeJS, use `node-localstorage` NPM module.',
		validationError: 'Validation failed. Action: ',
	})

	filter: This['filter'] = (...args) => filter(this.getAll(), ...args)

	find: This['find'] = predicateOrOptions =>
		find(this.getAll(), predicateOrOptions as Parameters<typeof find>[0])

	/**
	 * Trigger forced update of cached data from storage.
	 *
	 * @param name determines which cache-enabled storage instances to be updated.
	 * - name (`string` | `string[]`): update all instances with a specific name(s)
	 * - global (`true`): update all instances globally
	 *
	 * See {@link forceUpdateCache$} for more details.
	 */
	static forceUpdateCache = (name: string | string[] | true) => {
		forceUpdateCache$.next(name)
	}

	get: This['get'] = key => this.getAll().get(key)

	getAll: This['getAll'] = (forceRead = false) => {
		const wasInitialized = this.initialized
		if (!wasInitialized) this.init()

		const readFromStorage =
			this.cacheDisabled || (this.storage && forceRead)
		if (readFromStorage) {
			const data = this.read()
			const shouldTrigger = forceRead || (!wasInitialized && !!data.size)
			shouldTrigger && this.subject$.next(data)
			return data
		}

		return (this.subject$ as BehaviorSubject<Map<Key, Value>>).value
	}

	private handleForceUpdateCache = (name: string | string[] | boolean) => {
		const isTarget = !this.name
			? false
			: isArr(name)
				? name.includes(this.name)
				: isStr(name)
					? name === this.name
					: name === true
		if (!isTarget) return

		const newData = this.read()
		this.subject$.next(newData)
	}

	private handleSubjectChange = (data: Map<Key, Value>) => {
		// in-case non-map value is set, reset subject to an empty map
		if (!isMap(data)) return this.subject$.next(new Map())

		// write quietly
		fallbackIfFails(
			this.write,
			[data],
			this.triggerOnErrorCb(Store_OnErrorType.write),
		)

		fallbackIfFails(
			this.onChange?.bind(this) as unknown,
			[data],
			this.triggerOnErrorCb(Store_OnErrorType.onChange),
		)
	}

	has: This['has'] = key => this.getAll().has(key)

	init: This['init'] = (initialValue, checkStorage = true) => {
		if (this.initialized) return false

		if (this.name && checkStorage) {
			Object.defineProperty(this, 'storage', {
				value: fallbackIfFails(
					() => this.storage ?? globalThis.localStorage,
					[],
					undefined,
				),
			})
			if (!this.storage)
				throw new Error(Store.messages.invalidStorageOptions)
		}

		Object.defineProperty(this, 'initialized', { value: true })

		let firstValue = initialValue
		if (!!initialValue?.size || !this.cacheDisabled) {
			const dataStr = this.name ? this.storage?.getItem(this.name) : null
			const existingValue = this.read(dataStr ?? null)

			// If the entry exists in storage (even if it is empty), prioritize it over initialValue.
			// This prevents defaults from overwriting an intentionally cleared storage.
			if (isDefined(dataStr)) firstValue = existingValue
		}

		firstValue?.size && this.subject$.next(firstValue)

		this.unsubscribe()
		// update cached data from localStorage throughout the application only when triggered
		if (!this.cacheDisabled) {
			this.subscriptions.forceUpdateCache = forceUpdateCache$.subscribe(
				this.handleForceUpdateCache,
			)
		}

		const skipNum =
			this.subject$ instanceof BehaviorSubject
			&& firstValue?.size
			&& firstValue !== initialValue
				? 1
				: 0
		// Subscribe to data changes and write to storage.
		this.subscriptions.subject = this.subject$
			.pipe(skip(skipNum))
			.subscribe(
				!this.cacheDisabled && this.delay > 0
					? deferred(this.handleSubjectChange, this.delay, {
							thisArg: this,
							...this.delayOptions,
						})
					: this.handleSubjectChange,
			)

		return true
	}

	keys: This['keys'] = () => getKeys(this.getAll())

	map: This['map'] = callback =>
		this.toArray().map(([key, value], index, entries) =>
			callback(value, key, entries, index),
		)

	read: This['read'] = (
		dataStr = (this.name && this.storage?.getItem(this.name)) ?? null,
	) => {
		const data = fallbackIfFails(
			this.parse,
			[dataStr],
			this.triggerOnErrorCb(Store_OnErrorType.parse, undefined),
		)

		if (isMap(data) || !isStr(dataStr))
			return (
				(isFn(this.parse)
					? data
					: (this.subject$ as BehaviorSubject<Map<Key, Value>>).value)
				?? new Map<Key, Value>()
			)
		// use fallback JSON.parse if this.parse is not provided, returns non-Map value or fails
		return new Map<Key, Value>(
			fallbackIfFails(
				() => {
					const entries = JSON.parse(dataStr) as [Key, Value][]

					if (!isArr2D(entries))
						throw new Error(Store.messages.invalidJsonEntries)

					return entries
				},
				[],
				this.triggerOnErrorCb(Store_OnErrorType.parse_json),
			),
		)
	}

	search: This['search'] = (...args) => search(this.getAll(), ...args)

	set: This['set'] = (key, value) => {
		const data = this.getAll()

		const _value = isFn(value) ? value(data.get(key)) : value
		this.validate?.set?.call(this, [key, _value], 'set')
		data.set(key, _value)

		return this.setAll(data, true)
	}

	setAll: This['setAll'] = (data, replace = false) => {
		if (!isMap(data)) return this

		this.validate?.setAll?.call(this, [data, replace], 'setAll')

		data = replace
			? data // override all entries
			: mapJoin(this.getAll(), data) // merge with existing entries and override only matching keys
		this.subject$.next(new Map(data))
		return this
	}

	sort: This['sort'] = (...args) => {
		const result = sort(
			this.getAll(),
			args[0] as EntryComparator<Key, Value>,
			args[1],
		)
		args[1]?.save && this.setAll(result, true)

		return result
	}

	toArray: This['toArray'] = () => getEntries(this.getAll())

	toJSON: This['toJSON'] = (
		replacer,
		spacing = this.spaces,
		data = this.getAll(),
	) => {
		const str = fallbackIfFails(
			this.stringify as unknown as string,
			[data],
			this.triggerOnErrorCb(Store_OnErrorType.stringify, ''), // if fails return empty string
		)
		if (isStr(str)) return str

		// use fallback JSON.stringify if this.stringify returns non-string value (undefined)
		return fallbackIfFails(
			() =>
				JSON.stringify(
					Array.from(data),
					replacer as undefined,
					spacing,
				),
			[],
			this.triggerOnErrorCb(Store_OnErrorType.stringify_json, ''),
		)
	}

	toObject: This['toObject'] = <T>(data = this.getAll()) => {
		const obj = {} as T
		if (!isMap(data)) return obj

		for (const [key, value] of data)
			obj[key as unknown as keyof T] = value as T[keyof T]

		return obj
	}

	toString: This['toString'] = (data = this.getAll()) =>
		this.toJSON(undefined, undefined, data)

	private triggerOnErrorCb =
		<T = undefined>(
			type: Store_OnErrorType,
			returnValue: T = undefined as T,
		) =>
		(err: unknown) => {
			fallbackIfFails(
				this.onError?.bind(this) as unknown,
				[err, type],
				'',
			)

			return returnValue
		}

	unsubscribe: This['unsubscribe'] = () => {
		this.subscriptions.forceUpdateCache?.unsubscribe()
		this.subscriptions.subject?.unsubscribe()
		this.subscriptions = {
			forceUpdateCache: undefined,
			subject: undefined,
		}
	}

	values: This['values'] = () => getValues(this.getAll())

	write: This['write'] = data => {
		this.init()
		data ??= (this.subject$ as BehaviorSubject<Map<Key, Value>>)?.value
		if (!isMap(data) || !this.name || !this.storage) return false

		this.validate?.write?.call(this, [data], 'write')
		try {
			const jsonStr = this.toString(data)
			this.storage.setItem(this.name, jsonStr)

			return true
		} catch (err) {
			this.triggerOnErrorCb(Store_OnErrorType.write)(err)
			return false
		}
	}
}
export default Store
