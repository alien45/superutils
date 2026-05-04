import {
	deferred,
	EntryComparator,
	fallbackIfFails,
	filter,
	find,
	FindOptions,
	getEntries,
	getKeys,
	getValues,
	isArr,
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
import {
	DelayOptions,
	IDataStorage,
	OnErrorType,
	StorageCompact,
	StorageFilter,
	StorageFind,
	StorageMap,
	StorageOnChangeFn,
	StorageOnErrorFn,
	StorageOptions,
	StorageParseFn,
	StorageSearch,
	StorageSort,
	StorageStringifyFn,
	StorageToJSON,
} from './types'
import unsubscribeAll from '../unsubscribeAll'
import { UnwrapSubjectValue } from '../types'

/**
 * Force all or specific instances of DataStorage to reload data from storage
 *
 * @example
 * ```javascript
 * import { DataStorage } from '@superutils/rx'
 *
 * // Update all DataStorage instances with specific name(s)
 * const name = 'products'
 * forceUpdateCache$.next([name])
 *
 * // Update every single instance of DataStorage that uses storage (has a "name")
 * forceUpdateCache$.next(true)
 * ```
 */
export const forceUpdateCache$ = new Subject<string | string[] | boolean>()

export class DataStorage<
	Key,
	Value,
	CacheDisabled extends boolean = false,
> implements IDataStorage<Key, Value, CacheDisabled> {
	readonly cacheDisabled: CacheDisabled

	readonly delay: number

	/** Debounce and throttle related options */
	readonly delayOptions?: DelayOptions

	readonly initialized: boolean = false

	readonly name: string

	get size() {
		return this.getAll().size
	}

	spaces?: number

	readonly storage?: StorageCompact | null

	readonly subject!: CacheDisabled extends true
		? Subject<Map<Key, Value>>
		: BehaviorSubject<Map<Key, Value>>

	private subscriptions = {
		subject: undefined as Subscription | undefined,
		forceUpdateCache: undefined as Subscription | undefined,
	}

	/**
	 * A wrapper for reading and writing to LocalStorage (browser) or JSON files (NodeJS),
	 * providing a Map-like interface with advanced features like search, filtering, and sorting.
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
	 * @example
	 * #### Browser Usage
	 * ```javascript
	 * import { DataStorage } from '@superutils/rx'
	 * import fetch from '@superutils/fetch'
	 *
	 * const storage = new DataStorage('products')
	 * const { products } = await fetch('[DUMMYJSON-DOT-COM]/products')
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
	 * const { products } = await fetch('[DUMMYJSON-DOT-COM]/products')
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
	 * setTimeout(()=> sub.unsbuscribe(), 1000)
	 *
	 * // add an entry to storage
	 * storage.set('bob', { age: 99, id: 'bob', name: 'Bob' })
	 * ```
	 */
	constructor(
		name?: string | null,
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
			throw new Error(
				'options.storage: LocalStorage instance or equivalent required',
			)
		this.cacheDisabled = (!!this.storage && cacheDisabled) as CacheDisabled
		this.stringify = stringify
		this.spaces = spaces
		;(this.subject as unknown) = this.cacheDisabled
			? new Subject<Map<Key, Value>>()
			: new BehaviorSubject(undefined)
		this.delayOptions = delayOptions
		isMap(initialValue) && initialValue.size && this.init(initialValue)
	}

	clear() {
		this.setAll(new Map<Key, Value>(), true)
		return this
	}

	delete(keys: Key | Key[]) {
		if (!isArr(keys)) keys = [keys]

		const data = this.getAll()
		for (const k of keys) data.delete(k)

		this.setAll(data, true)
		return this
	}

	find(predicateOrOptions: Parameters<StorageFind<Key, Value>>[0]) {
		return find(
			this.getAll(),
			predicateOrOptions as FindOptions<Key, Value>,
		)
	}

	filter<AsArray extends boolean = false>(
		...args: Parameters<StorageFilter<Key, Value, AsArray>>
	) {
		return filter(this.getAll(), ...args)
	}

	/**
	 * Creates a {@link DataStorage} instance initialized from a plain object.
	 *
	 * This factory method automatically configures `parse` and `stringify` logic to
	 * treat the underlying storage as a serialized object, while providing a
	 * type-safe Map-like interface for individual properties.
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
		CacheDisabled extends boolean = false,
	>(
		name?: string,
		options?: Omit<
			StorageOptions<keyof T, T[keyof T], CacheDisabled>,
			'initialValue'
		> & { initialValue?: T },
	) =>
		new DataStorage(name, {
			parse: str => objToMap<T>(JSON.parse(str || '{}') as T),
			stringify: data =>
				JSON.stringify(DataStorage.prototype.toObject(data)),
			...(options as StorageOptions<keyof T, T[keyof T], CacheDisabled>),
			initialValue: !isObj(options?.initialValue, true)
				? options?.initialValue
				: objToMap<T>(options.initialValue),
		})

	/**
	 * Trigger forced update of cached data from storage.
	 *
	 * @param name determines which storage instances to be updated.
	 * - name (`string` | `string[]`): update all instances with a specific name(s)
	 * - global (`true`): update all instances globally
	 *
	 * @example
	 * ```javascript
	 * import { DataStorage } from '@superutils/rx'
	 *
	 * // Update all DataStorage instances with specific name(s)
	 * const name = 'products'
	 * DataStorage.forceUpdateCache([name])
	 *
	 * // Update every single instance of DataStorage that uses storage (has a "name")
	 * DataStorage.forceUpdateCache(true)
	 * ```
	 */
	static forceUpdateCache = (name: string | string[] | true) => {
		forceUpdateCache$.next(name)
	}

	get(key: Key) {
		return this.getAll().get(key)
	}

	getAll(forceRead = false) {
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
			?? new Map()
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

	has(key: Key) {
		return this.getAll().has(key)
	}

	init(initialValue?: Map<Key, Value>) {
		if (this.initialized) return false
		;(this.initialized as unknown) = true

		let isEmpty = true
		if (!!initialValue?.size || !this.cacheDisabled) {
			const existingValue = this.read()
			// ignore initial value if storage contains existing value
			if (existingValue.size) initialValue = existingValue
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

	keys() {
		return getKeys(this.getAll())
	}

	map<T>(callback: Parameters<StorageMap<Key, Value, T>>[0]) {
		return this.toArray().map(([key, value], index, data) =>
			callback(value, key, data, index),
		)
	}

	onChange?: StorageOnChangeFn<Key, Value, CacheDisabled>

	onError?: StorageOnErrorFn<Key, Value, CacheDisabled>

	readonly parse?: StorageParseFn<Key, Value, CacheDisabled>

	read() {
		const dataStr = this.storage?.getItem(this.name) ?? ''
		const parse = this.parse?.bind(this) as StorageParseFn<
			Key,
			Value,
			CacheDisabled
		>
		const data = fallbackIfFails(
			parse,
			[dataStr],
			this.triggerOnError(OnErrorType.parse),
		)
		if (isMap<Key, Value>(data)) return data

		// use fallback JSON.parse if this.parse is not provided, returns non-Map value or fails
		return new Map<Key, Value>(
			fallbackIfFails(
				() => JSON.parse(dataStr) as [Key, Value][],
				[],
				this.triggerOnError(OnErrorType.parse_json),
			),
		)
	}

	search<MatchExact extends boolean = false, AsMap extends boolean = true>(
		options: Parameters<StorageSearch<Key, Value, MatchExact, AsMap>>[0],
	) {
		return search(this.getAll(), options)
	}

	set(key: Key, value: Value) {
		this.setAll(new Map([[key, value]]), false)
		return this
	}

	setAll(data = new Map<Key, Value>(), replace = false) {
		if (!isMap(data)) return this

		data = replace
			? data // override all entries
			: mapJoin(this.getAll(), data) // merge with existing entries and override only matching keys
		this.subject.next(new Map(data))
		return this
	}

	sort(...args: Parameters<StorageSort<Key, Value>>) {
		const result = sort(
			this.getAll(),
			args[0] as EntryComparator<Key, Value>,
			args[1],
		)
		args[1]?.save && this.setAll(result, true)

		return result
	}

	readonly stringify?: StorageStringifyFn<Key, Value, CacheDisabled>

	toArray() {
		return getEntries(this.getAll())
	}

	toJSON(
		...[replacer, spacing = this.spaces, data = this.getAll()]: Parameters<
			StorageToJSON<Key, Value>
		>
	) {
		const stringify = this.stringify?.bind(this) as StorageStringifyFn<
			Key,
			Value,
			CacheDisabled
		>
		const str = fallbackIfFails(
			stringify,
			[data],
			this.triggerOnError(OnErrorType.stringify),
		)
		if (isStr(str)) return str

		// use fallback JSON.stringify if this.stringify is not provided, returns non-string value or fails
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

	toObject<T extends object = object>(
		data: Map<Key, Value> = this?.getAll?.(),
	) {
		const obj = {} as T

		data = !isMap(data) ? new Map<Key, Value>() : data
		for (const [key, value] of data)
			obj[key as unknown as keyof T] = value as T[keyof T]

		return obj
	}

	toString(data?: Map<Key, Value>) {
		return this.toJSON(undefined, undefined, data)
	}

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

	unsubscribe() {
		return unsubscribeAll(this.subscriptions)
	}

	values() {
		return getValues(this.getAll())
	}

	write(data?: Map<Key, Value>) {
		try {
			!this.initialized && this.init()
			data ??= (this.subject as BehaviorSubject<Map<Key, Value>>).value
			if (!this.name || !this.storage || !isMap(data)) return false

			this.storage.setItem(this.name, this.toString(data))

			return true
		} catch (err) {
			this.triggerOnError(OnErrorType.write)(err)
			return false
		}
	}
}
export default DataStorage
