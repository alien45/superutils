import {
	deferred,
	EntryComparator,
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
	isObj,
	isPositiveNumber,
	isStr,
	mapJoin,
	objToMap,
	search,
	sort,
} from '@superutils/core'
import { BehaviorSubject, skip, Subject, Subscription } from '../rxjs'
import { UnwrapSubjectValue } from '../types'
import unsubscribeAll from '../unsubscribeAll'
import type { IDataStorage, IObjectStorage, StorageOptions } from './types'
import { OnErrorType } from './types'

/**
 * RxJS Subject to trigger forced update of cached data from underlying storage of {@link DataStorage} instances.
 *
 * `value`: determines which cache-enabled storage instances to be updated
 * - name (`string` | `string[]`): update all instances with a specific name(s)
 * - global (`true`): update all instances globally
 *
 * @example
 * ```javascript
 * import { DataStorage, forceUpdateCache$ } from '@superutils/rx'
 *
 * const names = ['products', 'users']
 *
 * // Update all DataStorage instances by a list of their names
 * forceUpdateCache$.next(names)
 * // alternatively: DataStorage.forceUpdateCache(names)
 *
 * // Update all DataStorage instances with a specific name
 * forceUpdateCache$.next(names[0])
 * // alternatively: DataStorage.forceUpdateCache(names[0])
 *
 * // Update every single instance of DataStorage that uses storage (has a "name" property)
 * forceUpdateCache$(true)
 * // alternatively: DataStorage.forceUpdateCache(true)
 * ```
 *
 * @example
 *
 * #### Practical example
 * ```typescript
 * import { DataStorage } from '@superutils/rx'
 *
 * const name = 'user-profile'
 * type User = {
 *   age: number
 *   name: string
 *   roles?: string[]
 * }
 * const userStore = DataStorage.(name, { delay: 0 }) // delay is set to zero to simplify the example
 * userStore.set('name', 'John Doe')
 * userStore.set('name', 'John Doe')
 * ```
 */
export const forceUpdateCache$ = new Subject<string | string[] | boolean>()

/**
 * A generic, reactive data storage class that provides a Map-like interface with advanced features
 * such as search, filtering, and sorting. Supports both in-memory caching and persistent storage
 * (LocalStorage in browsers, JSON files in NodeJS via `node-localstorage` NPM module).
 *
 * #### Notes:
 * - **Performance**: `DataStorage` is optimized for small to medium datasets.
 *   - For datasets > 1MB, consider increasing the `delay` option to reduce write frequency.
 *   - It is **NOT** recommended for datasets larger than 3MB due to synchronous serialization costs.
 * - **RxJS Integration**: Built on RxJS for reactive data handling, though no prior RxJS knowledge is required.
 * - **Storage Behavior**:
 *   - If `name` is omitted, the instance operates in-memory only and data is not persisted to storage.
 *   - If `cacheDisabled` is `true`, data is not kept in memory; every read/write operation accesses the underlying
 * storage directly.
 *
 * @template Key The type of keys stored in the map.
 * @template Value The type of values stored in the map.
 * @template CacheDisabled A literal boolean type indicating whether in-memory caching is disabled.
 * @template This A self-referential interface type extending {@link IDataStorage} used for accurate
 *   method signature inference and type-safe property access. This allows method implementations to
 *   reference their return types and other method signatures through the interface definition.
 *
 * @see {@link forceUpdateCache$} for cache invalidation across instances.
 * @see {@link DataStorage.fromObject} for object-oriented storage initialization.
 *
 * @example
 * #### Browser Usage 1: use like a map
 * ```javascript
 * import { DataStorage } from '@superutils/rx'
 *
 * const userStorage = new DataStorage('users')
 * userStorage.set(1, { name: 'Alice', age: 30 })
 * const user = userStorage.get(1)
 * console.log(user) // prints: {name: 'Alice', age: 30}
 * ```
 *
 * @example
 * #### Browser Usage 2:
 * ```javascript
 * import { DataStorage } from '@superutils/rx'
 * import fetch from '@superutils/fetch'
 *
 * const { products } = await fetch.get('[DUMMYJSON-DOT-COM]/products')
 * const storage = new DataStorage('products', {
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
 * import { DataStorage } from '@superutils/rx'
 * import fetch from '@superutils/fetch'
 * import { LocalStorage } from 'node-localstorage'
 *
 * // Add localStorage alternative for NodeJS that reads and writes to JSON files.
 * // This is not necessary for browsers.
 * globalThis.localStorage = new LocalStorage('./data', 1e7)
 *
 * const storage = new DataStorage('products')
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
 * Internally, `DataStorage` uses RxJS subject which is exposed as `subject` property.
 * You can use this to subscribe to changes and do additional operations such as logging or sanitization etc.
 *
 * Alternatively, you can also set the `onChange` callback which is triggered whenever the subject changes and
 * does not require maintaining a subscription or knowledge of RxJS subject.
 *
 * ```javascript
 * import { DataStorage } from '@superutils/rx'
 *
 * const storage = new DataStorage('my-data')
 * const sub = storage.subject.subscribe(data => {
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
export class DataStorage<
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
	This extends IDataStorage<Key, Value, CacheDisabled> = IDataStorage<
		Key,
		Value,
		CacheDisabled
	>,
> implements IDataStorage<Key, Value, CacheDisabled> {
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

	readonly subject!: This['subject']

	private subscriptions = {
		subject: undefined as Subscription | undefined,
		forceUpdateCache: undefined as Subscription | undefined,
	}

	constructor(
		name?: This['name'],
		options?: StorageOptions<Key, Value, CacheDisabled>,
	) {
		const {
			cacheDisabled = false as CacheDisabled,
			delay,
			delayOptions,
			initialValue,
			onError,
			onChange,
			parse,
			spaces,
			storage,
			stringify,
		} = options ?? {}
		this.delay = delay === 0 || isPositiveNumber(delay) ? delay : 300
		this.name = `${name ?? ''}`.trim()
		this.onError = onError
		this.onChange = onChange
		this.parse = parse
		this.storage =
			storage === null
				? null
				: (storage
					?? fallbackIfFails(
						() => globalThis.localStorage,
						[],
						undefined,
					))
		if (this.name && !this.storage)
			throw new Error(DataStorage.messages.invalidOptionsStorage)
		this.cacheDisabled = (!!this.storage && cacheDisabled) as CacheDisabled
		this.stringify = stringify
		this.spaces = spaces
		this.subject = (
			this.cacheDisabled ? new Subject() : new BehaviorSubject(undefined)
		) as This['subject']
		this.delayOptions = delayOptions
		isMap(initialValue) && initialValue.size && this.init(initialValue)
	}

	clear: This['clear'] = () => this.setAll(new Map<Key, Value>(), true)

	delete: This['delete'] = keys => {
		if (!isArr(keys)) keys = [keys]

		const data = this.getAll()
		for (const k of keys) data.delete(k)

		this.setAll(data, true)
		return this
	}

	static messages = Object.seal({
		invalidJsonEntries:
			'Invalid JSON format. Parsed value must be a 2D array representing key-value pairs.',
		invalidOptionsStorage:
			'options.storage: LocalStorage instance or equivalent required',
	})

	filter: This['filter'] = (...args) => filter(this.getAll(), ...args)

	find: This['find'] = predicateOrOptions =>
		find(this.getAll(), predicateOrOptions as Parameters<typeof find>[0])

	/**
	 * Creates a {@link DataStorage} instance initialized from a plain object.
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
	 * @returns A new DataStorage instance mapped to the object's keys and values.
	 *
	 * @example
	 * #### Store and access a User object
	 * ```typescript
	 * import { DataStorage } from '@superutils/rx'
	 *
	 * interface User {
	 *   age: number;
	 *   name: string;
	 * }
	 *
	 * const initialValue: User = {
	 *   age: 99,
	 *   name: 'Ninety Nine'
	 * }
	 *
	 * // Initialize storage from the object
	 * const storage = DataStorage.fromObject<User>('user-profile', { initialValue })
	 *
	 * // Keys are inferred from the User interface
	 * const name = storage.get('name') // Inferred as: string | undefined
	 * console.log(name) // Prints: 'Ninety Nine'
	 *
	 * // Update properties safely
	 * storage.set('age', 100)
	 *
	 * // Reconstruct the updated object
	 * const userObj = storage.toObject<User>()
	 * console.log(userObj) // { age: 100, name: 'Ninety Nine' }
	 * ```
	 */
	static fromObject = <
		T extends object,
		Key extends keyof T = keyof T,
		Value extends T[Key] = T[Key],
		CacheDisabled extends boolean = false,
	>(
		name?: string | null,
		options?: Omit<
			StorageOptions<Key, Value, CacheDisabled>,
			'initialValue'
		> & { initialValue?: T },
	) => {
		const instance = new DataStorage(name, {
			parse: str => objToMap<T>(JSON.parse(str ?? '{}') as T),
			stringify: function (data) {
				return JSON.stringify(this.toObject(data))
			},
			...(options as StorageOptions<Key, Value, CacheDisabled>),
			initialValue: !isObj(options?.initialValue, true)
				? options?.initialValue
				: objToMap<T>(options.initialValue),
		}) as unknown as IObjectStorage<T, CacheDisabled>

		;(instance as { isObjectStorage: true }).isObjectStorage = true
		return instance
	}

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

		const readFromStorage = this.cacheDisabled || (this.name && forceRead)
		if (readFromStorage) {
			const data = this.read()
			const shouldTrigger = forceRead || (!wasInitialized && !!data.size)
			shouldTrigger && this.subject.next(data)
			return data
		}

		return (
			(this.subject as BehaviorSubject<Map<Key, Value>>)?.value
			?? new Map<Key, Value>()
		)
	}

	private handleForceUpdateCacheChange = (
		name: UnwrapSubjectValue<typeof forceUpdateCache$>,
	) => {
		const isTarget = !this.name
			? false
			: isArr(name)
				? name.includes(this.name)
				: isStr(name)
					? name === this.name
					: name === true
		if (!isTarget) return

		const newData = this.read()
		this.subject.next(newData)
	}

	private handleSubjectChange = (data: Map<Key, Value>) => {
		// in-case non-map value is set, reset subject to an empty map
		if (!isMap(data)) return this.subject.next(new Map())

		this.write(data)

		fallbackIfFails(
			this.onChange?.bind(this) as unknown,
			[data],
			this.triggerOnError(OnErrorType.onChange),
		)
	}

	has: This['has'] = key => this.getAll().has(key)

	init: This['init'] = initialValue => {
		if (this.initialized) return false
		;(this.initialized as unknown) = true

		let isEmpty = true
		if (!!initialValue?.size || !this.cacheDisabled) {
			const dataStr = this.name ? this.storage?.getItem(this.name) : null
			const existingValue = this.read(dataStr)

			// If the entry exists in storage (even if it is empty), prioritize it over initialValue.
			// This prevents defaults from overwriting an intentionally cleared storage.
			if (isDefined(dataStr)) initialValue = existingValue

			isEmpty = this.cacheDisabled || existingValue.size === 0
		}

		initialValue?.size && this.subject.next(initialValue)

		unsubscribeAll(this.subscriptions)
		// update cached data from localStorage throughout the application only when triggered
		if (!this.cacheDisabled) {
			this.subscriptions.forceUpdateCache = forceUpdateCache$.subscribe(
				this.handleForceUpdateCacheChange,
			)
		}
		// Subscribe to data changes and write to storage.
		this.subscriptions.subject = this.subject
			.pipe(skip(this.cacheDisabled || isEmpty ? 0 : 1))
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
		dataStr = this.name ? this.storage?.getItem(this.name) : null,
	) => {
		// no underlying storage used >> in-memory only >> no need to parse
		if (!this.name)
			return (
				(this.subject as BehaviorSubject<Map<Key, Value>>).value
				?? new Map<Key, Value>()
			)

		const data = fallbackIfFails(
			() => this.parse?.call(this, dataStr),
			[],
			this.triggerOnError(OnErrorType.parse),
		)
		if (isFn(this.parse) || !isStr(dataStr))
			return data ?? new Map<Key, Value>()

		// use fallback JSON.parse if this.parse is not provided, returns non-Map value or fails
		return new Map<Key, Value>(
			fallbackIfFails(
				() => {
					const entries = JSON.parse(dataStr) as [Key, Value][]

					if (!isArr2D(entries))
						throw new Error(DataStorage.messages.invalidJsonEntries)

					return entries
				},
				[],
				this.triggerOnError(OnErrorType.parse_json),
			),
		)
	}

	search: This['search'] = (...args) => search(this.getAll(), ...args)

	set: This['set'] = (key, value) => {
		const data = this.getAll()
		data.set(key, isFn(value) ? value(data.get(key)) : value)

		return this.setAll(data, true)
	}

	setAll: This['setAll'] = (data, replace = false) => {
		if (!isMap(data)) return this

		data = replace
			? data // override all entries
			: mapJoin(this.getAll(), data) // merge with existing entries and override only matching keys
		this.subject.next(new Map(data))
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
			(() => this.stringify?.call(this, data)) as unknown as string,
			[],
			this.triggerOnError(OnErrorType.stringify, ''), // if fails return empty string
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
			this.triggerOnError<string>(OnErrorType.stringify_json, ''),
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

	private triggerOnError =
		<T = undefined>(type: OnErrorType, returnValue: T = undefined as T) =>
		(err: unknown) => {
			fallbackIfFails(
				this.onError?.bind(this) as unknown,
				[err, type],
				'',
			)

			return returnValue
		}

	unsubscribe: This['unsubscribe'] = () => {
		unsubscribeAll(this.subscriptions)
		this.subscriptions = {} as unknown as typeof this.subscriptions
	}

	values: This['values'] = () => getValues(this.getAll())

	write: This['write'] = data => {
		try {
			!this.initialized && this.init()
			const finalData =
				data
				?? (this.subject as BehaviorSubject<Map<Key, Value>>)?.value

			if (!this.name || !this.storage || !isMap(finalData)) return false

			this.storage.setItem(this.name, this.toString(finalData))

			return true
		} catch (err) {
			this.triggerOnError(OnErrorType.write)(err)
			return false
		}
	}
}
export default DataStorage
