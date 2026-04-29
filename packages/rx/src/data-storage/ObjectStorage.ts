import { isFn, objToMap, ValueOrPromise } from '@superutils/core'
import { BehaviorSubject, Subject } from '../rxjs'
import DataStorage from './DataStorage'
import { StorageOptions } from './types'

export class ObjectStorage<
	T extends object,
	Key extends string & keyof T,
	Value extends { value: T[keyof T] },
	CacheDisabled extends boolean = false,
> {
	private _lStorage: DataStorage<Key, Value, CacheDisabled>
	public onChange?: (values: T) => ValueOrPromise<void | T>
	public spaces?: number
	public readonly subject: CacheDisabled extends true
		? Subject<Map<Key, Value>>
		: BehaviorSubject<Map<Key, Value>>

	constructor(
		public readonly name: string,
		options: Omit<
			StorageOptions<Key, Value, CacheDisabled>,
			'initialValue' | 'onChange' | 'parse' | 'stringify'
		> & {
			initialValue: T
			onChange?: (values: T) => ValueOrPromise<void | T>
		},
	) {
		this.spaces = options?.spaces
		this.onChange = options?.onChange
		this._lStorage = new DataStorage(this.name, {
			...options,
			initialValue: !options?.initialValue
				? undefined
				: objToMap(options.initialValue, true),
			onChange: (map: Map<Key, Value>) => {
				if (!isFn(this.onChange)) return

				const obj = {} as T
				for (const [key, { value }] of map.entries()) {
					obj[key as keyof T] = value
				}

				return this.onChange(obj)
			},
		} as unknown as StorageOptions<Key, Value, CacheDisabled>)

		this.subject = this._lStorage.subject
	}

	get<K extends Key>(key: K) {
		return this._lStorage.get(key)?.value
	}

	getAll(): T {
		const obj = {} as T
		for (const [key, value] of this._lStorage.toArray()) {
			obj[key as keyof T] = value.value
		}
		return obj
	}

	has(key: Key) {
		return key in this.getAll()
	}

	keys() {
		return Object.keys(this.getAll()) as Key[]
	}

	set<K extends Key>(key: K, value: T[K]) {
		this._lStorage.set(key, { value } as unknown as Value)
		return this
	}

	setAll(values: Partial<T>, replace = false) {
		this._lStorage.setAll(
			objToMap(values, true) as Map<Key, Value>,
			replace,
		)
		return this
	}

	toArray() {
		return Object.entries(this.getAll()) as [Key, T[keyof T]][]
	}

	toJSON(replacer?: Parameters<typeof JSON.stringify>[1], spaces?: number) {
		return JSON.stringify(this.getAll(), replacer, spaces ?? this.spaces)
	}

	toString() {
		return this.toJSON()
	}

	unsubscribe() {
		this._lStorage.unsubscribe()
	}

	values() {
		return Object.values(this.getAll()) as T[keyof T][]
	}
}
