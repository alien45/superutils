import { BehaviorSubject, Subject } from 'rxjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	DataStorage,
	StorageCompact,
	StorageKey,
	StorageValue,
	unsubscribeAll,
} from '../../src'

class MockLocalStorage implements StorageCompact {
	storage = new Map<string, string>()

	getItem = vi.fn((key: string): string | null => {
		return this.storage.get(key) ?? null
	})

	setItem = vi.fn((key: string, value: string): void => {
		this.storage.set(key, value)
	})
}

describe('DataStorage', () => {
	let mockedStorage: MockLocalStorage
	const delay = 0 // keep 0 to write "almost" synchronously and keep testing simpler
	const name = 'test'
	const key = 'key'
	const value = { value: 1 }
	const entries = [[key, value]] as [string, { value: number }][]
	const entriesStr = JSON.stringify(entries)
	beforeEach(() => {
		mockedStorage = new MockLocalStorage()
		vi.stubGlobal('localStorage', mockedStorage)
	})
	afterEach(() => {
		vi.unstubAllGlobals()
		vi.useRealTimers()
	})

	it('should convert all items to an array', () => {
		const arr = new DataStorage(null, {
			initialValue: new Map(entries),
		}).toArray()
		expect(arr).toEqual(entries)
	})

	it('should convert all items to a string', () => {
		const str = new DataStorage(null, {
			initialValue: new Map(entries),
		}).toString()
		expect(str).toEqual(JSON.stringify(entries))
	})

	it('should convert all items to an object', () => {
		const obj = new DataStorage(null, {
			initialValue: new Map([
				['key1', { value: 1 }],
				['key2', { value: 2 }],
			]),
		}).toObject()

		expect(obj).toEqual({
			key1: { value: 1 },
			key2: { value: 2 },
		})
	})

	it('should accept interfaces and classes', () => {
		class Test {
			value = 1
		}
		new DataStorage(null, { initialValue: new Map([['key', new Test()]]) })

		interface TestInterface {
			value: number
		}
		new DataStorage(null, {
			initialValue: new Map([['key', { value: 1 } as TestInterface]]),
		})
	})

	it('should read & write to mocked localStorage and initialize on first write', () => {
		const storage = new DataStorage(name, { delay })
		expect(storage.initialized).toBe(false)
		storage.getAll(true)
		storage.set(key, value)
		expect(storage.subject).instanceOf(BehaviorSubject)
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

	it('should initialize on first read', () => {
		const storage = new DataStorage(name, { delay })
		expect(storage.initialized).toBe(false)
		expect(storage.size).toBe(0)
		expect(storage.initialized).toBe(true)
	})

	it('should create throw error when localStorage is not available', () => {
		const createInstance = vi.fn(
			() => new DataStorage(name, { delay, storage: null }),
		)
		expect(createInstance).toThrow(
			'options.storage: LocalStorage instance or equivalent required',
		)
		expect(createInstance).toHaveBeenCalled()
	})

	it('should ignore if non-Map value provided to setAll()', () => {
		const storage = new DataStorage(name, {
			delay,
			initialValue: null as any,
		})
		expect(storage.initialized).toBe(false)

		storage.setAll(null as any)
		expect(storage.initialized).toBe(false)
	})

	it('should create create an cache-only (in-memory) instance', () => {
		vi.stubGlobal('localStorage', null)
		const storage = new DataStorage(null, { delay })
		storage.set(key, value)
		expect(storage.subject).instanceOf(Subject)
		expect(storage.toArray()).toEqual(entries)
		expect(mockedStorage.getItem).not.toHaveBeenCalled()
		expect(mockedStorage.setItem).not.toHaveBeenCalled()
	})

	it('should create an instance with cache disabled and read/write directly from storage', () => {
		const storage = new DataStorage(name, { cacheDisabled: true })
		expect(mockedStorage.getItem).toHaveBeenCalledTimes(0)
		expect(storage.cacheDisabled).toBe(true)
		expect(storage.subject).instanceOf(Subject)
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

	it('should set initial value', () => {
		const initialValue = new Map(entries)
		const storage = new DataStorage(name, { delay, initialValue })
		expect(storage.get(key)).toEqual(value)
		expect(storage.storage === localStorage).toBe(true)
		expect(mockedStorage.getItem).toHaveBeenCalledWith(name)
		expect(mockedStorage.setItem).toHaveBeenCalledWith(name, entriesStr)
	})

	it('should unsubscribe all internall subscriptions', () => {
		const initialValue = new Map(entries)
		const storage = new DataStorage('unsubscribe', { delay, initialValue })
		expect(storage.initialized).toBe(true)
		storage.unsubscribe()

		storage.set('keyx', { value: 2 })
		const newEntries = [...entries, ['keyx', { value: 2 }]]
		expect(storage.toArray()).toEqual(newEntries)
		expect(mockedStorage.getItem(storage.name)).toEqual(
			JSON.stringify(entries),
		)

		// write manually
		storage.write()
		expect(mockedStorage.getItem(storage.name)).toEqual(
			JSON.stringify(newEntries),
		)
	})

	it('should clear storage', () => {
		const storage = new DataStorage(name, {
			delay,
			initialValue: new Map(entries),
		})
		expect(storage.get(key)).toEqual(value)
		expect(storage.size).toBe(1)
		storage.clear()
		expect(storage.get(key)).toEqual(undefined)
		expect(storage.size).toBe(0)
	})

	it('should delete items', () => {
		const storage = new DataStorage(name, {
			delay,
			initialValue: new Map(entries),
		})
		expect(storage.get(key)).toEqual(value)
		expect(storage.size).toBe(1)
		storage.delete(key)
		expect(storage.get(key)).toEqual(undefined)
		expect(storage.size).toBe(0)

		storage.setAll(new Map([...entries, ['key2', { value: 2 }]]))
		expect(storage.size).toBe(2)
		storage.delete([key, 'key2'])
		expect(storage.size).toBe(0)
	})
	it('should avoid write operation if storage name is not specified', () => {
		const storage = new DataStorage(undefined, { delay })
		expect(storage.write(null as any)).toBe(false)
	})

	it('should avoid write operation if data is not a Map or undefined', () => {
		const storage = new DataStorage(name, { delay })
		expect(storage.write(new Map())).toBe(true)
		expect(storage.write(undefined)).toBe(true)
		expect(storage.write({} as any)).toBe(false)
		expect(storage.write(false as any)).toBe(false)
	})

	it('should ignore if already initialized', () => {
		const storage = new DataStorage(name, {
			delay,
			initialValue: new Map(entries),
		})
		expect(storage.initialized).toBe(true)
		expect(storage.init()).toBe(false)
	})

	it('should return empty map if non-map value set directly to the subject', () => {
		const storage = new DataStorage(name, {
			delay,
			initialValue: new Map(entries),
		})
		expect(storage.subject instanceof BehaviorSubject).toBe(true)
		storage.subject.next(null as any)
		expect(storage.getAll()).toEqual(new Map())
	})

	describe('writing based on caching and delay', () => {
		it('should write to storage after default delay with debounce', () => {
			vi.useFakeTimers()
			const storage = new DataStorage(name)
			storage.set(key, value)
			expect(mockedStorage.setItem).toHaveBeenCalledTimes(0)
			vi.advanceTimersByTime(storage.delay)
			expect(mockedStorage.setItem).toHaveBeenCalledTimes(1)
		})

		it('should write to storage each time data changes when cache is disabled', () => {
			const storage = new DataStorage(name, { cacheDisabled: true })
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
			const storage = new DataStorage(name, {
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

	describe('find, filter, search & sort', () => {
		const entries = [
			['bob', { age: 22, name: 'bob' }],
			['charlie', { age: 23, name: 'charlie' }],
			['alice', { age: 21, name: 'alice' }],
			['dave', { age: 24, name: 'dave' }],
		] as [string, { age: number; name: string }][]
		let storage: DataStorage<string, { age: number; name: string }>
		beforeEach(() => {
			storage = new DataStorage(name, {
				delay,
				initialValue: new Map(entries),
			})
		})
		it('should find item by predicate and search options', () => {
			expect(storage.find({ query: 'bob' })?.name).toBe('bob')
			expect(storage.find(item => item.age === 21)?.name).toBe('alice')
		})

		it('should filter items', () => {
			const result = storage.filter(item => item.age > 21, 5, true)
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
		const simulateTest =
			(storageName: Parameters<typeof DataStorage.forceUpdateCache>[0]) =>
			async () => {
				const names =
					storageName === true
						? [name]
						: Array.isArray(storageName)
							? storageName
							: [storageName]
				const subjectOnChange = vi.fn()
				const storages = names.map(
					name =>
						new DataStorage(name, {
							delay,
							initialValue: new Map(entries),
						}),
				)

				// make sure the initial value is stored
				const subs = storages.map(storage => {
					const sub = storage.subject.subscribe(subjectOnChange)
					expect(storage.toArray()).toEqual(entries)

					// manually set value to the underlying storage
					const newStr = JSON.stringify([
						...entries,
						['key1', { value: 1 }],
					])
					mockedStorage.setItem(storage.name, newStr)
					expect(mockedStorage.storage.get(storage.name)).toBe(newStr)
					return sub
				})

				expect(mockedStorage.getItem).toHaveBeenCalledTimes(
					storages.length,
				)
				expect(subjectOnChange).toHaveBeenCalledTimes(storages.length)

				// trigger a forced update of all storages with cache enabled
				DataStorage.forceUpdateCache(storageName)

				expect(mockedStorage.getItem).toHaveBeenCalledTimes(
					storages.length * 2,
				)
				expect(subjectOnChange).toHaveBeenCalledTimes(
					storages.length * 2,
				)
				// unsubscribe from all storages
				unsubscribeAll(subs)
			}

		it('should update cached data for all instances', simulateTest(true))

		it('should update cached data for named instance', simulateTest(name))

		it(
			'should update cached data of array of instances',
			simulateTest([name, 'test2', 'test3']),
		)
	})

	describe('callbacks', () => {
		it('should trigger "onChange" callback', () => {
			const handleChange = vi.fn()
			const storage = new DataStorage(name, {
				delay,
				onChange: handleChange,
			})
			expect(handleChange).not.toHaveBeenCalled()
			storage.set(key, value)
			expect(handleChange).toHaveBeenCalledWith(new Map(entries))
			expect(handleChange).toHaveBeenCalledTimes(1)

			storage.set('key2', { value: 2 })
			expect(handleChange).toHaveBeenCalledTimes(2)

			storage.clear()
			expect(handleChange).toHaveBeenCalledTimes(3)
		})

		it('should invoke "onError" callback', () => {
			mockedStorage = new MockLocalStorage()
			mockedStorage.getItem = (() => 'malformed JSON') as any
			vi.stubGlobal('localStorage', mockedStorage)
			const handleError = vi.fn()
			const storage = new DataStorage(name, {
				cacheDisabled: true,
				initialValue: new Map(entries),
				onError: handleError,
			})
			expect(handleError).toHaveBeenCalledTimes(1)
			storage.getAll(true)
			expect(handleError).toHaveBeenCalledTimes(2)
		})

		it('should invoke "onError" when write operation fails', () => {
			const onError = vi.fn()
			const storage = new DataStorage(name, { delay, onError })
			// set setItem to null to trigger write failure
			;(storage.storage as StorageCompact).setItem = null as any
			expect(storage.write(new Map())).toBe(false)
			expect(onError).toHaveBeenCalledExactlyOnceWith(
				expect.any(Error),
				'write',
			)
		})

		it('should invoke "parse" callback', () => {
			const handleParse = vi.fn(
				str => new Map<StorageKey, StorageValue>(JSON.parse(str)),
			)
			const storage = new DataStorage(name, {
				delay,
				initialValue: new Map(entries),
				parse: handleParse,
			})
			expect(storage.parse === handleParse).toBe(true)
			expect(handleParse).toHaveBeenCalledTimes(1)
			storage.getAll(true) // force read from storage and invoke "parse" callback
			expect(handleParse).toHaveBeenCalledTimes(2)
		})

		it('should invoke "stringify" callback', () => {
			const stringify = vi.fn(map => JSON.stringify(Array.from(map)))
			const storage = new DataStorage(name, {
				delay,
				initialValue: new Map(entries),
				stringify,
			})
			expect(storage.stringify === stringify).toBe(true)
			expect(stringify).toHaveBeenCalledTimes(1)
			storage.clear()
			expect(stringify).toHaveBeenCalledTimes(2)
		})
	})
})
