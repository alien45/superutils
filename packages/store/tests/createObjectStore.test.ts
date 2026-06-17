import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { createObjectStore, IObjectStore, Store, TEXTS } from '../src'
import MockLocalStorage from './MockLocalStorage.ts'
import { isArr2D } from '@superutils/core'

describe('createObjectStore', () => {
	let mockedStorage: MockLocalStorage
	const noDelay = 0 // keep 0 to write immediately and keep testing simpler
	const name = 'createObjectStore'
	type User = { id: string; name: string; age: number }

	beforeEach(() => {
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
		expect(objStore.onError).toHaveBeenCalledTimes(0) // correct value type => no error
		expect(
			() =>
				// incorrect value type => throws error
				new Store(name, {
					delay: noDelay,
					initialValue: new Map([['count', 0]]),
				}),
		).toThrow(TEXTS.invalidJsonEntries)
	})

	it('should invoke `value` callback on object storage instance.set()', () => {
		let count = 0
		const valueCallback = vi.fn(() => ++count)
		const objStore = createObjectStore<{ count: number }>({
			delay: noDelay,
			initialValue: { count: 0 },
			name,
		})

		objStore.set('count', valueCallback)
		expect(valueCallback).toHaveBeenCalledExactlyOnceWith(0)
		expect(objStore.get('count')).toEqual(count)
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

	it('should convert object to map', () => {
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

	it('should stringify with spaces', () => {
		const initialValue = {
			a: 0,
			b: 0,
		}
		createObjectStore({
			delay: noDelay,
			initialValue,
			name,
			spaces: 2,
		})

		expect(mockedStorage.getItem(name)).toBe(
			JSON.stringify(initialValue, null, 2),
		)
	})

	it('should parse existing value as object', () => {
		const name = 'createObjectStore'
		mockedStorage.setItem(name, JSON.stringify({ a: 1, b: 2 }))

		const objStore = createObjectStore({
			delay: noDelay,
			name,
			initialValue: { a: 0, b: 0 },
		})
		expect(objStore.get('a')).toBe(1)
		expect(objStore.get('b')).toBe(2)
		expect(objStore.getAll().size).toBe(2)
	})

	it('should invoke onError when parsig existing value as object fails', () => {
		const name = 'createObjectStore'
		new Store(name, {
			delay: noDelay,
			initialValue: new Map([
				['a', 1],
				['b', 2],
			]),
		})

		const onError = vi.fn()
		expect(() =>
			createObjectStore({
				delay: noDelay,
				name,
				initialValue: { a: 0, b: 0 },
				onError,
			}),
		).toThrow(TEXTS.invalidJsonObject)
		expect(onError).toHaveBeenCalledTimes(1)
	})
})
