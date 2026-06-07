import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { createObjectStore, objToMap, Store } from '../src'
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

	it('should create an in-memory store', () => {
		const store = createObjectStore({
			context: store => ({
				user: null as User | null,
				getUser(id: string): User {
					const user: User = {
						id,
						name: 'bob',
						age: 22,
					}
					this.user = user
					store.setAll(objToMap(user))
					return user
				},
			}),
			initialValue: {} as User,
		})

		store.context.getUser('bob')
		expect(store.context.user?.name).toEqual('bob')
		expect(store.get('name')).toBe('bob')

		expect(store.storage).toBe(undefined)
		expect(mockedStorage.getItem).not.toHaveBeenCalled()
		expect(mockedStorage.setItem).not.toHaveBeenCalled()
	})
})

// describe('fromObject', () => {
// 	it('should contain the correct type property', () => {
// 		expect(createObjectStore().type).toBe('object')
// 	})

// 	it('should create a storage instance from an object', () => {
// 		const storage = createObjectStore(name, {
// 			delay: noDelay,
// 			initialValue: {
// 				age: 99,
// 				name: 'Ninety Nine',
// 			},
// 		})
// 		expect(storage.get('age')).toBe(99)
// 		expect(storage.get('age')).toBeTypeOf('number')
// 		expect(storage.get('name')).toBe('Ninety Nine')
// 		expect(storage.get('name')).toBeTypeOf('string')
// 		expect(storage.getAll().size).toBe(2)
// 	})

// 	it('should create a storage instance from an object without initial value', () => {
// 		const storage = createObjectStore<{
// 			age: Number
// 			name: string
// 		}>(name, { delay: noDelay })
// 		expect(storage.get('age')).toBe(undefined)
// 		expect(storage.get('name')).toBe(undefined)
// 		expect(storage.getAll().size).toBe(0)
// 	})

// 	it('should invoke onError when JSON data type mismatch occurs', () => {
// 		// create two storages with the same name but two different data types (2D array and object)
// 		const name = 'mismatch'
// 		const objStore = createObjectStore(name, {
// 			delay: noDelay,
// 			initialValue: {
// 				age: 99,
// 				name: 'Ninety Nine',
// 			},
// 			onError: vi.fn(),
// 		})
// 		const dataStore = new Store(name, {
// 			delay: noDelay,
// 			initialValue,
// 			onError: vi.fn(),
// 		})
// 		expect(dataStore.onError).toHaveBeenCalledTimes(1)
// 		expect(objStore.onError).toHaveBeenCalledTimes(0)
// 	})

// 	it('should invoke `value` callback on object storage instance.set()', () => {
// 		let count = 0
// 		const valueCallback = vi.fn(() => ++count)
// 		const objStore = createObjectStore<{ [key]: number }>('obj', {
// 			delay: noDelay,
// 			initialValue: { [key]: 0 },
// 		})

// 		objStore.set(key, valueCallback)
// 		expect(valueCallback).toHaveBeenCalledExactlyOnceWith(0)
// 		expect(objStore.get(key)).toEqual(count)
// 	})
// })
