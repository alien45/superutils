import { unsubscribeAll } from '@superutils/rx'
import { BehaviorSubject, Subject } from 'rxjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	createObjectStore,
	Store,
	Store_OnErrorType,
	type StorageCompact,
} from '../src'
import MockLocalStorage from './MockLocalStorage'

describe('Srore', () => {
	let mockedStorage: MockLocalStorage
	const noDelay = 0 // keep 0 to write immediately and keep testing simpler
	const name = 'test'
	type Key = string
	type Value = { value: number }
	const key: Key = 'key'
	const value: Value = { value: 1 }
	const entries = [[key, value]] as [Key, Value][]
	const entriesStr = JSON.stringify(entries)
	let initialValue: Map<Key, Value>

	beforeEach(() => {
		initialValue = new Map<Key, Value>(entries)
		mockedStorage = new MockLocalStorage()
		vi.stubGlobal('localStorage', mockedStorage)
	})
	afterEach(() => {
		vi.unstubAllGlobals()
		vi.useRealTimers()
		vi.resetModules()
	})

	describe('initialization and general', () => {
		it('should contain the correct type property', () => {
			expect(new Store().type).toBe('map')
		})

		it('should convert all items to an array', () => {
			const arr = new Store(null, { initialValue }).toArray()
			expect(arr).toEqual(entries)
		})

		it('should convert all items to a string', () => {
			const str = new Store(null, { initialValue }).toString()
			expect(str).toEqual(JSON.stringify(entries))
		})

		it('should accept interfaces and classes', () => {
			class Test {
				value = 1
			}
			new Store(null, {
				initialValue: new Map([['key', new Test()]]),
			})

			interface TestInterface {
				value: number
			}
			const storage = new Store(null, {
				initialValue: new Map([[key, { value: 1 } as TestInterface]]),
			})
			expect(storage.get(key)).toEqual({ value: 1 })
		})

		it('should read & write to mocked localStorage and initialize on first write', () => {
			const storage = new Store(name, { delay: noDelay })
			expect(storage.initialized).toBe(false)
			storage.getAll(true)
			storage.set(key, value)
			expect(storage.subject$).instanceOf(BehaviorSubject)
			expect(storage.initialized).toBe(true)
			expect(storage.get(key)).toEqual(value)
			expect(storage.has(key)).toBe(true)
			expect(storage.size).toBe(1)
			expect(mockedStorage.getItem).toHaveBeenCalledWith(name)
			expect(mockedStorage.setItem).toHaveBeenCalledWith(name, entriesStr)
			expect(storage.map(v => v)).toEqual([value])
			expect(storage.values()).toEqual([value])
			expect(storage.keys()).toEqual([key])
		})

		it('should initialize on first read when initialValue is not provided', () => {
			const storage = new Store(name, { delay: noDelay })
			expect(storage.initialized).toBe(false)
			expect(storage.size).toBe(0)
			expect(storage.initialized).toBe(true)
		})

		it('should create throw error when localStorage is not available', () => {
			const createInstance = vi.fn(
				() => new Store(name, { delay: noDelay, storage: null }),
			)
			expect(createInstance).toThrow(
				'options.storage: LocalStorage instance or equivalent required',
			)
			expect(createInstance).toHaveBeenCalled()
		})

		it('should ignore if non-Map value provided to setAll()', () => {
			const storage = new Store(name, {
				delay: noDelay,
				initialValue: null as any,
			})
			expect(storage.initialized).toBe(false)

			storage.setAll(null as any)
			expect(storage.initialized).toBe(false)
		})

		it('should create create an cache-only (in-memory) instance', () => {
			vi.stubGlobal('localStorage', null)
			const storage = new Store(null, { delay: noDelay })
			storage.set(key, value)
			expect(storage.subject$).instanceOf(Subject)
			expect(storage.toArray()).toEqual(entries)
			expect(mockedStorage.getItem).not.toHaveBeenCalled()
			expect(mockedStorage.setItem).not.toHaveBeenCalled()
		})

		it('should create an instance with cache disabled and read/write directly from storage', () => {
			const storage = new Store(name, { cacheDisabled: true })
			expect(mockedStorage.getItem).toHaveBeenCalledTimes(0)
			expect(storage.cacheDisabled).toBe(true)
			expect(storage.subject$).instanceOf(Subject)
			storage.set(key, value)
			expect(mockedStorage.setItem).toHaveBeenCalledTimes(1)
			expect(mockedStorage.getItem).toHaveBeenCalledTimes(1)
			expect(storage.toArray()).toEqual(entries)
			expect(mockedStorage.getItem).toHaveBeenCalledTimes(2)
			storage.set('key2', { value: 2 })
			expect(mockedStorage.setItem).toHaveBeenCalledTimes(2)
			expect(mockedStorage.getItem).toHaveBeenCalledTimes(3)
			storage.set(key, value)
			expect(mockedStorage.setItem).toHaveBeenCalledTimes(3)
			expect(mockedStorage.getItem).toHaveBeenCalledTimes(4)
			storage.size
			expect(mockedStorage.getItem).toHaveBeenCalledTimes(5)
		})

		it('should use RxJS `Subject` when no name provided and cache is disabled', () => {
			const storage = new Store(null, {
				cacheDisabled: true,
			})
			expect(storage.subject$).instanceOf(Subject)
		})

		it('should set initial value', () => {
			const initialValue = new Map(entries)
			const storage = new Store(name, {
				delay: noDelay,
				initialValue,
			})
			expect(storage.get(key)).toEqual(value)
			expect(storage.storage === localStorage).toBe(true)
			expect(mockedStorage.getItem).toHaveBeenCalledWith(name)
			expect(mockedStorage.setItem).toHaveBeenCalledWith(name, entriesStr)
		})

		it('should avoid write operation if storage name is not specified', () => {
			const storage = new Store(undefined, { delay: noDelay })
			expect(storage.write(null as any)).toBe(false)
		})

		it('should avoid write operation if data is not a Map or undefined', () => {
			const storage = new Store(name, { delay: noDelay })
			expect(storage.write(new Map())).toBe(true)
			expect(storage.write(undefined)).toBe(true) // uses this.getAll()
			expect(storage.write({} as any)).toBe(false)
			expect(storage.write(false as any)).toBe(false)
		})

		it('should ignore init() call if already initialized', () => {
			const storage = new Store(name, {
				delay: noDelay,
				initialValue,
			})
			expect(storage.initialized).toBe(true)
			expect(storage.init()).toBe(false)
		})

		it('should ignore initial value if storage is not empty', () => {
			mockedStorage.setItem(name, entriesStr)
			const storage = new Store(name, {
				delay: noDelay,
				initialValue: new Map([['initial', { value: 2 }]]),
			})
			expect(storage.get('initial')).toBe(undefined)
			expect(storage.get(key)).toEqual(value)
		})

		it('should return empty map if non-map value is set directly to the subject', () => {
			const storage = new Store(name, {
				delay: noDelay,
				initialValue,
			})
			expect(storage.subject$ instanceof BehaviorSubject).toBe(true)
			storage.subject$.next(null as any)
			expect(storage.getAll()).toEqual(new Map())
		})

		it('should convert all items to an object using toObject()', () => {
			const storage = new Store(null, { initialValue })
			const obj = storage.toObject<{ string: Value }>()
			expect(obj).toEqual({ key: { value: 1 } })
		})

		it('should ignore when non-map value is provided to toObject()', () => {
			const storage = new Store(name, { initialValue })
			expect(storage.toObject(null as any)).toEqual({})
		})

		it('should unsubscribe all internall subscriptions', () => {
			const initialValue = new Map(entries)
			const onChange = vi.fn()
			const storage = new Store('unsubscribe', {
				delay: noDelay,
				initialValue,
				onChange,
			})
			expect(storage.initialized).toBe(true)
			storage.unsubscribe()

			storage.set('keyx', { value: 2 })
			const newEntries = [...entries, ['keyx', { value: 2 }]]
			expect(storage.toArray()).toEqual(newEntries)
			expect(mockedStorage.getItem(storage.name!)).toEqual(
				JSON.stringify(entries),
			)

			// write manually
			storage.write()
			expect(mockedStorage.getItem(storage.name!)).toEqual(
				JSON.stringify(newEntries),
			)
		})

		it('should return subject value when name is not defined', () => {
			const storage = new Store(null, { initialValue })
			expect(storage.read()).toBe(initialValue)
		})
	})

	describe('caching and delay options', () => {
		it('should write to storage after default delay with debounce', () => {
			vi.useFakeTimers()
			const storage = new Store(name)
			storage.set(key, value)
			expect(mockedStorage.setItem).toHaveBeenCalledTimes(0)
			vi.advanceTimersByTime(storage.delay)
			expect(mockedStorage.setItem).toHaveBeenCalledTimes(1)
		})

		it('should write to storage immediately when cache is disabled', () => {
			const stoage = new Store(name, { cacheDisabled: true })
			stoage.set(key, value)
			expect(mockedStorage.setItem).toHaveBeenCalledTimes(1)
			expect(mockedStorage.getItem).toHaveBeenCalledTimes(1)
			stoage.set(key, value)
			expect(mockedStorage.setItem).toHaveBeenCalledTimes(2)
			expect(mockedStorage.getItem).toHaveBeenCalledTimes(2)
		})

		it('should write to storage immediately when delay is 0', async () => {
			const storage = new Store(name, {
				delay: noDelay,
				initialValue,
			})
			expect(mockedStorage.setItem).toHaveBeenCalledTimes(1)

			storage.set('key', { value: 2 })
			expect(mockedStorage.setItem).toHaveBeenCalledTimes(2)

			expect(storage.get('key')).toEqual({ value: 2 })
		})

		it('should write to storage each time data changes when cache is disabled', () => {
			const storage = new Store(name, { cacheDisabled: true })
			const count = 10
			const entries = []
			for (let i = 0; i < count; i++) {
				const key = 'key' + i
				const value = { value: i }
				storage.set(key, value)
				entries.push([key, value])
			}
			expect(mockedStorage.setItem).toHaveBeenCalledTimes(count)
			expect(mockedStorage.getItem).toHaveBeenCalledTimes(count)
			expect(JSON.parse(mockedStorage.getItem(name) || '[]')).toEqual(
				entries,
			)
		})

		it('should write to storage after debouce delay when cache is enabled', () => {
			vi.useFakeTimers()
			const delay = 500
			const storage = new Store(name, {
				cacheDisabled: false,
				delay,
			})
			const count = 10
			const expectedEntries = []
			for (let i = 0; i < count; i++) {
				const key = 'key' + i
				const value = { value: i }
				storage.set(key, value)
				expectedEntries.push([key, value])
			}
			expect(mockedStorage.setItem).toHaveBeenCalledTimes(0)
			vi.advanceTimersByTime(storage.delay)
			expect(mockedStorage.setItem).toHaveBeenCalledTimes(1)
			expect(mockedStorage.getItem).toHaveBeenCalledTimes(1)
			const entries = mockedStorage.getItem(name) || '[]'
			expect(entries).toEqual(JSON.stringify(expectedEntries))
		})
	})

	describe('callbacks', () => {
		it('should invoke "onError" callback', () => {
			mockedStorage = new MockLocalStorage()
			mockedStorage.getItem = (() => 'malformed JSON') as any
			vi.stubGlobal('localStorage', mockedStorage)

			let thisArg: Store<Key, Value, true>
			const onError = vi.fn(function (this: typeof thisArg) {
				thisArg ??= this
			})
			const storage = new Store(name, {
				cacheDisabled: true,
				initialValue,
				onError,
				storage: mockedStorage,
			})
			expect(onError).toHaveBeenCalledTimes(1)
			storage.getAll(true)
			expect(onError).toHaveBeenCalledTimes(2)

			expect(thisArg!).toBe(storage)
		})

		it('should invoke "onError" when write operation fails', () => {
			const onError = vi.fn()
			const storage = new Store(name, {
				cacheDisabled: true,
				onError,
			})
			expect(onError).toHaveBeenCalledTimes(0)
			// set setItem to null to trigger write failure
			;(storage.storage as StorageCompact).setItem = null as any
			expect(storage.write(new Map())).toBe(false)

			expect(onError).toHaveBeenCalledTimes(1)
			expect(onError).toHaveBeenCalledWith(
				expect.any(Error),
				Store_OnErrorType.write,
			)
		})

		it('should trigger "onChange" callback', () => {
			let thisArg: Store<unknown, unknown, true>
			const onChange = vi.fn(function (this: typeof thisArg) {
				thisArg ??= this
			})
			const storage = new Store(name, {
				cacheDisabled: true,
				onChange,
			})
			expect(onChange).not.toHaveBeenCalled()
			storage.set(key, value)
			expect(onChange).toHaveBeenCalledWith(new Map(entries))
			expect(onChange).toHaveBeenCalledTimes(1)

			storage.set('key2', { value: 2 })
			expect(onChange).toHaveBeenCalledTimes(2)

			storage.clear()
			expect(onChange).toHaveBeenCalledTimes(3)

			expect(thisArg!).toBe(storage)
		})

		it('should invoke "parse" callback', () => {
			let thisArg: Store<Key, Value, false>
			const parse = vi.fn(function (
				this: typeof thisArg,
				str?: string | null,
			) {
				thisArg ??= this
				return new Map<Key, Value>(JSON.parse(str ?? ''))
			})
			const storage = new Store(name, {
				delay: noDelay,
				initialValue,
				parse,
			})
			expect(parse).toHaveBeenCalledTimes(1)
			storage.getAll(true) // force read from storage and invoke "parse" callback
			expect(parse).toHaveBeenCalledTimes(2)

			expect(thisArg!).toBe(storage)
		})

		it('should invoke "stringify" callback', () => {
			let thisArg: Store<Key, Value, false>
			const stringify = vi.fn(function (
				this: typeof thisArg,
				map: Map<unknown, unknown>,
			) {
				thisArg ??= this
				return JSON.stringify(Array.from(map))
			})
			const storage = new Store(name, {
				delay: noDelay,
				initialValue,
				stringify,
			})
			expect(stringify).toHaveBeenCalledTimes(1)
			storage.clear()
			expect(stringify).toHaveBeenCalledTimes(2)

			expect(thisArg!).toBe(storage)
		})

		it('should invoke "parse" and "stingify" callbacks when in in-memory mode (no name provided)', () => {
			let count = 0
			const parse = vi.fn(() => new Map([['count', ++count]]))
			const stringify = vi.fn(() => '')
			const storage = new Store<string, number>(null, {
				delay: noDelay,
				parse,
				stringify,
			})
			expect(parse).not.toHaveBeenCalled()
			storage.init()
			expect(parse).toHaveBeenCalledOnce()
		})

		it('should invoke `value` callback on instance.set()', () => {
			let count = 0
			const valueCallback = vi.fn(() => ({ value: ++count }))
			const storage = new Store<Key, Value>(name, {
				delay: noDelay,
				initialValue: new Map(),
			})

			storage.set(key, valueCallback)
			expect(valueCallback).toHaveBeenCalledExactlyOnceWith(undefined)
			expect(storage.get(key)).toEqual({ value: 1 })

			storage.set(key, valueCallback)
			expect(valueCallback).toHaveBeenNthCalledWith(2, { value: 1 })
			expect(storage.get(key)).toEqual({ value: 2 })
		})
	})

	describe('data manipulation', () => {
		type User = { age: number; name: string }
		const entries = [
			['bob', { age: 22, name: 'bob' }],
			['charlie', { age: 23, name: 'charlie' }],
			['alice', { age: 21, name: 'alice' }],
			['dave', { age: 24, name: 'dave' }],
		] as [Key, User][]
		let storage: Store<Key, User>

		beforeEach(() => {
			storage?.clear()
			storage = new Store(name, {
				delay: noDelay,
				initialValue: new Map(entries),
			})
		})

		it('should merge with existing items by default when using instance.setAll', () => {
			expect(storage.getAll().size).toBe(4)

			storage.setAll(new Map([['nobody', { age: 0, name: 'nobody' }]]))
			expect(storage.getAll().size).toBe(5)
		})

		it('should clear storage', () => {
			expect(storage.size).toBe(4)
			storage.clear()
			expect(storage.getAll().size).toBe(0)
			expect(storage.size).toBe(0)
		})

		it('should delete items', () => {
			expect(storage.get('bob')).toEqual({ age: 22, name: 'bob' })
			expect(storage.getAll().size).toBe(4)
			storage.delete('bob')
			expect(storage.get('bob')).toEqual(undefined)
			expect(storage.size).toBe(3)
		})

		it('should find item by predicate and search options', () => {
			expect(storage.find({ query: 'bob' })?.name).toBe('bob')
			expect(storage.find({ query: 'bob', includeKey: true })).toEqual([
				'bob',
				{ age: 22, name: 'bob' },
			])
			expect(storage.find(item => item.age === 21)?.name).toBe('alice')
		})

		it('should filter items', () => {
			const result = storage.filter(item => item.age > 21, 5)
			expect(result.length).toBe(3)
		})

		it('should search items', () => {
			const result = storage.search({ query: /li/ })
			expect(result.size).toBe(2)
			expect(result.get('alice')?.name).toBe('alice')
			expect(result.get('charlie')?.name).toBe('charlie')
		})

		it('should sort items', () => {
			const initialKeys = storage.keys()
			expect(initialKeys).toEqual(['bob', 'charlie', 'alice', 'dave'])
			storage.sort('name', { save: true })
			expect(storage.keys()).toEqual(['alice', 'bob', 'charlie', 'dave'])
		})
	})

	describe('forceUpdateCache', () => {
		beforeEach(() => {
			mockedStorage = new MockLocalStorage()
			vi.stubGlobal('localStorage', mockedStorage)
		})
		const simulateForceUpdateByName =
			(storageName: Parameters<typeof Store.forceUpdateCache>[0]) =>
			async () => {
				const names =
					storageName === true
						? [name]
						: Array.isArray(storageName)
							? storageName
							: [storageName]
				const subjectOnChange = vi.fn()
				const storages = names.map(name => {
					const storage = new Store(name, {
						delay: noDelay,
						initialValue,
					})
					return storage
				})

				// make sure the initial value is stored
				const subs = storages.map(storage => {
					const sub = storage.subject$.subscribe(subjectOnChange)
					expect(storage.toArray()).toEqual(entries)

					// manually set value to the underlying storage
					const newStr = JSON.stringify([
						...entries,
						['key1', { value: 1 }],
					])
					mockedStorage.setItem(storage.name!, newStr)
					expect(mockedStorage.storage.get(storage.name!)).toBe(
						newStr,
					)
					return sub
				})

				expect(mockedStorage.getItem).toHaveBeenCalledTimes(
					storages.length,
				)
				expect(subjectOnChange).toHaveBeenCalledTimes(storages.length)

				// trigger a forced update of all storages with cache enabled
				Store.forceUpdateCache(storageName)

				expect(mockedStorage.getItem).toHaveBeenCalledTimes(
					storages.length * 2,
				)
				expect(subjectOnChange).toHaveBeenCalledTimes(
					storages.length * 2,
				)
				// unsubscribe from all storages
				unsubscribeAll(subs)
			}

		it(
			'should update cached data for all cache enabled instances',
			simulateForceUpdateByName(true),
		)

		it(
			'should update cached data for cache enabled instance by name',
			simulateForceUpdateByName(name),
		)

		it(
			'should update cached data for cache enabled instance by array of names',
			simulateForceUpdateByName([name, 'test2', 'test3']),
		)
	})

	describe('fromObject', () => {
		it('should contain the correct type property', () => {
			expect(createObjectStore().type).toBe('object')
		})

		it('should create a storage instance from an object', () => {
			const storage = createObjectStore(name, {
				delay: noDelay,
				initialValue: {
					age: 99,
					name: 'Ninety Nine',
				},
			})
			expect(storage.get('age')).toBe(99)
			expect(storage.get('age')).toBeTypeOf('number')
			expect(storage.get('name')).toBe('Ninety Nine')
			expect(storage.get('name')).toBeTypeOf('string')
			expect(storage.getAll().size).toBe(2)
		})

		it('should create a storage instance from an object without initial value', () => {
			const storage = createObjectStore<{
				age: Number
				name: string
			}>(name, { delay: noDelay })
			expect(storage.get('age')).toBe(undefined)
			expect(storage.get('name')).toBe(undefined)
			expect(storage.getAll().size).toBe(0)
		})

		it('should invoke onError when JSON data type mismatch occurs', () => {
			// create two storages with the same name but two different data types (2D array and object)
			const name = 'mismatch'
			const objStore = createObjectStore(name, {
				delay: noDelay,
				initialValue: {
					age: 99,
					name: 'Ninety Nine',
				},
				onError: vi.fn(),
			})
			const dataStore = new Store(name, {
				delay: noDelay,
				initialValue,
				onError: vi.fn(),
			})
			expect(dataStore.onError).toHaveBeenCalledTimes(1)
			expect(objStore.onError).toHaveBeenCalledTimes(0)
		})

		it('should invoke `value` callback on object storage instance.set()', () => {
			let count = 0
			const valueCallback = vi.fn(() => ++count)
			const objStore = createObjectStore<{ [key]: number }>('obj', {
				delay: noDelay,
				initialValue: { [key]: 0 },
			})

			objStore.set(key, valueCallback)
			expect(valueCallback).toHaveBeenCalledExactlyOnceWith(0)
			expect(objStore.get(key)).toEqual(count)
		})
	})
})
