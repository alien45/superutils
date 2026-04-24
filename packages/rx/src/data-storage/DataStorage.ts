/* eslint-disable @typescript-eslint/no-floating-promises */
import {
	deferred,
	fallbackIfFails,
	filter,
	find,
	getEntries,
	getKeys,
	isArr,
	isFn,
	isMap,
	isPositiveNumber,
	isStr,
	mapJoin,
	search,
	sort,
	SortOptions,
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
	StorageValue,
} from './types'
import unsubscribeAll from '../unsubscribeAll'

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
	Value extends StorageValue,
	CacheDisabled extends boolean = false,
> implements IDataStorage<Key, Value, CacheDisabled> {
	readonly cacheDisabled: CacheDisabled

	readonly delay: number

	readonly delayOptions?: DelayOptions

	/** Debounce and throttle related options */
	// readonly deferOptions

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
		this.delay = cacheDisabled
			? 0
			: delay === 0 || isPositiveNumber(delay)
				? delay
				: 300
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

	readonly clear = () => {
		this.setAll(new Map<Key, Value>(), true)
		return this
	}

	readonly delete = (keys: Key | Key[]) => {
		if (!isArr(keys)) keys = [keys]

		const data = this.getAll()
		for (const k of keys) data.delete(k)

		this.setAll(data, true)
		return this
	}

	readonly find: StorageFind<Key, Value> = predicateOrOptions =>
		find(this.getAll(), predicateOrOptions as Parameters<typeof find>[1])

	readonly filter: StorageFilter<Key, Value> = (
		predicate,
		limit,
		asArray,
		result,
	) => filter(this.getAll(), predicate, limit, asArray, result)

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

	readonly get = (key: Key) => this.getAll().get(key)

	readonly getAll = (forceRead = false) => {
		const wasInitialized = this.initialized
		if (!wasInitialized) this.init()

		const readFromStorage = this.cacheDisabled || (this.name && forceRead)
		if (readFromStorage) {
			const data = this.read()
			const shouldTrigger = forceRead || (!wasInitialized && !!data.size)
			shouldTrigger && this.subject.next(data)
			return data
		}

		return (this.subject as BehaviorSubject<Map<Key, Value>>)?.value
	}

	readonly has = (key: Key) => this.getAll().has(key)

	readonly init = (initialValue?: Map<Key, Value>) => {
		if (this.initialized) return false
		;(this.initialized as unknown) = true

		this.subject instanceof BehaviorSubject
			&& this.subject.next(this.read())

		unsubscribeAll(this.subscriptions)
		// update cached data from localStorage throughout the application only when triggered
		if (!this.cacheDisabled) {
			this.subscriptions.forceUpdateCache = forceUpdateCache$.subscribe(
				refresh => {
					const doRefresh = !this.name
						? false
						: isArr(refresh)
							? refresh.includes(this.name)
							: isStr(refresh)
								? refresh === this.name
								: refresh === true

					if (!doRefresh) return
					const newData = this.read()
					this.subject.next(newData)
				},
			)
		}
		!(this.subject as BehaviorSubject<Map<Key, Value>>)?.value?.size
			&& isMap(initialValue)
			&& !!initialValue?.size
			&& this.setAll(initialValue)

		const piped = this.subject.pipe(
			skip(this.cacheDisabled || !!initialValue?.size ? 0 : 1),
		)
		let handleChange = (data: Map<Key, Value>) => {
			// in-case non-map value is set, set it to empty map
			if (!isMap(data)) return this.subject.next(new Map<Key, Value>())

			this.write(data)
			fallbackIfFails(
				async () => await this.onChange?.(data),
				[],
				this.triggerOnError('onChange'),
			)
		}
		if (this.delay > 0)
			handleChange = deferred(handleChange, this.delay, this.delayOptions)
		// Subscribe to data changes and write to storage.
		this.subscriptions.subject = piped.subscribe(handleChange)
		return true
	}

	readonly keys = () => getKeys(this.getAll())

	readonly map: StorageMap<Key, Value> = callback =>
		this.toArray().map(([key, value], index, data) =>
			callback(value, key, data, index),
		)

	onChange?: StorageOnChangeFn<Key, Value>

	onError?: StorageOnErrorFn

	readonly parse?: StorageParseFn<Key, Value>

	readonly read = () => {
		// !this.initialized && this.init()
		const dataStr = this.storage?.getItem(this.name) ?? '[]'
		const data =
			isFn(this.parse)
			&& fallbackIfFails(
				this.parse,
				[dataStr],
				this.triggerOnError('parse'),
			)
		if (isMap<Key, Value>(data)) return data

		// use fallback JSON.parse if this.parse is not provided, returns non-Map value or fails
		return new Map<Key, Value>(
			fallbackIfFails(
				() => JSON.parse(dataStr) as [Key, Value][],
				[],
				this.triggerOnError('parse-json'),
			),
		)
	}

	readonly search: StorageSearch<Key, Value> = options =>
		search(this.getAll(), options)

	readonly set = (key: Key, value: Value) => {
		this.setAll(new Map([[key, value]]), false)
		return this
	}

	readonly setAll = (data = new Map<Key, Value>(), replace = false) => {
		if (!isMap(data)) return this

		data = replace
			? data // override all entries
			: mapJoin(this.getAll(), data) // merge with existing entries and override only matching keys
		this.subject.next(new Map(data))
		return this
	}

	readonly sort: StorageSort<Key, Value> = ((nameOrComparator, options) => {
		const result = sort(
			this.getAll(),
			nameOrComparator as string,
			options as SortOptions,
		)
		options?.save && this.setAll(result, true)

		return result
	}) as StorageSort<Key, Value>

	readonly stringify?: StorageStringifyFn<Key, Value>

	readonly toArray = () => getEntries(this.getAll())

	readonly toJSON: StorageToJSON<Key, Value> = (
		replacer,
		spacing = this.spaces,
		data = this.getAll(),
	) => {
		const arr = Array.from(data)
		const str = fallbackIfFails(
			() => this.stringify?.(data),
			[],
			this.triggerOnError('stringify'),
		)
		if (isStr(str)) return str

		// use fallback JSON.stringify if this.stringify is not provided, returns non-string value or fails
		return fallbackIfFails(
			() => JSON.stringify(arr, replacer as undefined, spacing),
			[],
			this.triggerOnError('stringify-json'),
		)
	}

	readonly toString = (data?: Map<Key, Value>) =>
		this.toJSON(undefined, undefined, data)

	private triggerOnError = (type: OnErrorType) => (err: unknown) => {
		this.onError && fallbackIfFails(this.onError, [err, type], '')
	}

	readonly unsubscribe = () => unsubscribeAll(this.subscriptions)

	readonly values = () => [...this.getAll().values()]

	readonly write = (data?: Map<Key, Value>) => {
		try {
			!this.initialized && this.init()
			data ??= (this.subject as BehaviorSubject<Map<Key, Value>>).value

			if (!this.name || !this.storage || !isMap(data)) return false
			this.storage.setItem(this.name, this.toString(data))
			return true
		} catch (err) {
			this.triggerOnError('write')(err)
			return false
		}
	}
}
export default DataStorage
