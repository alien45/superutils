import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { createObjectStore, IObjectStore, Store } from '../src'
import MockLocalStorage from './MockLocalStorage.ts'

describe('createObjectStore', () => {
	let mockedStorage: MockLocalStorage
	const noDelay = 0 // keep 0 to write immediately and keep testing simpler
	const name = 'test'
	type Key = string
	type Value = { value: number }
	const key: Key = 'key'
	const value: Value = { value: 1 }
	const entries = [[key, value]] as [Key, Value][]
	let initialValue: Map<Key, Value>
	type User = { id: string; name: string; age: number }

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

	it('should contain the correct type property', () => {
		expect(createObjectStore().type).toBe('object')
	})

	it('should create a storage instance from an object', () => {
		const storage = createObjectStore({
			delay: noDelay,
			initialValue: {
				age: 99,
				name: 'Ninety Nine',
			},
			name,
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
		}>({ delay: noDelay, name })
		expect(storage.get('age')).toBe(undefined)
		expect(storage.get('name')).toBe(undefined)
		expect(storage.getAll().size).toBe(0)
	})

	it('should invoke onError when JSON data type mismatch occurs', () => {
		// create two storages with the same name but two different data types (2D array and object)
		const name = 'mismatch'
		const objStore = createObjectStore({
			delay: noDelay,
			initialValue: {
				age: 99,
				name: 'Ninety Nine',
			},
			onError: vi.fn(),
			name,
		})
		const mapStore = new Store(name, {
			delay: noDelay,
			initialValue,
			onError: vi.fn(),
		})
		expect(mapStore.onError).toHaveBeenCalledTimes(1)
		expect(objStore.onError).toHaveBeenCalledTimes(0)
	})

	it('should invoke `value` callback on object storage instance.set()', () => {
		let count = 0
		const valueCallback = vi.fn(() => ++count)
		const objStore = createObjectStore<{ [key]: number }>({
			delay: noDelay,
			initialValue: { [key]: 0 },
			name,
		})

		objStore.set(key, valueCallback)
		expect(valueCallback).toHaveBeenCalledExactlyOnceWith(0)
		expect(objStore.get(key)).toEqual(count)
	})

	it('should create an in-memory store', () => {
		const onChange = vi.fn()
		const getContext = vi.fn((store: IObjectStore<User>) => ({
			getUser(id: string): User {
				const user: User = {
					id,
					name: 'bob',
					age: 22,
				}
				this.user = user
				store.setAll(user)
				return user
			},
			user: null as User | null,
		}))
		const store = createObjectStore(
			{ delay: noDelay, initialValue: {} as User, onChange },
			getContext,
		)

		expect(getContext).toHaveBeenCalledExactlyOnceWith(store)
		expect(onChange).not.toHaveBeenCalled()

		store.getUser('bob')
		expect(store.user?.name).toEqual('bob')
		expect(onChange).toHaveBeenCalledTimes(2) // one for init() and one for setAll()
		expect(store.get('name')).toBe('bob')

		expect(store.storage).toBe(undefined)
		expect(mockedStorage.getItem).not.toHaveBeenCalled()
		expect(mockedStorage.setItem).not.toHaveBeenCalled()
	})

	it('should conver object to map', () => {
		const store = createObjectStore({
			delay: noDelay,
			initialValue: {
				a: 0,
				b: 0,
			},
		})
		expect(store.toMap()).toEqual(
			new Map([
				['a', 0],
				['b', 0],
			]),
		)
		expect(store.toMap({ a: 1, b: 2 })).toEqual(
			new Map([
				['a', 1],
				['b', 2],
			]),
		)
	})
})
