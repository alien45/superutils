import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { createStore, type IStore } from '../src'
import MockLocalStorage from './MockLocalStorage'

describe('createStore', () => {
	let mockedStorage: MockLocalStorage

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

	it('should create a store with no context', () => {
		const store = createStore()
		expect((store as any).context).toEqual(undefined)
	})

	it('should create a store with context object', () => {
		const before = new Date()
		const store = createStore(undefined, {
			context: {
				updatedTs: null as Date | null,
				getUser(id: string): User {
					this.updatedTs = new Date()
					return {
						id,
						name: 'Bob',
						age: 22,
					}
				},
			},
		})

		const user = store.context.getUser('1')
		const after = new Date()
		expect(user).toEqual({
			id: '1',
			name: 'Bob',
			age: 22,
		})
		expect(store.context.updatedTs).toBeInstanceOf(Date)
		expect(store.context.updatedTs?.getTime()).toBeGreaterThanOrEqual(
			before.getTime(),
		)
		expect(store.context.updatedTs?.getTime()).toBeLessThanOrEqual(
			after.getTime(),
		)
	})

	it('should accept class instance as context', () => {
		class Ctx {
			// direct variables and function-variables will work
			private _count = 0
			increment = () => {
				this._count++
			}

			// getters and methods will not work
			get count() {
				return this._count
			}
			getCount() {
				return this._count
			}
		}
		const store = createStore({ name: 'test getter' }, new Ctx())
		expect(store.count).toBe(0)
		expect(store.getCount?.()).toBe(0)

		expect((store as any)._count).toBe(0)
		store.increment()
		expect((store as any)._count).toBe(1)
	})

	it('should ignore store property names being provided as context', () => {
		const store = createStore(null, {
			get: 1,
			storage: 'test',
		} as any)
		expect(store.get).not.toBe(1 as any)
		expect(store.get).instanceOf(Function)

		expect(store.storage).not.toBe('test')
		expect(store.storage).toBe(undefined)
	})

	it('should create a store with context function', () => {
		const before = new Date()
		const context = (store: IStore<any, any>) => ({
			updatedTs: null as Date | null,
			getUser(id: string): User {
				this.updatedTs = new Date()
				const user = {
					id,
					name: 'Bob',
					age: 22,
				}
				store.set(id, user)
				return user
			},
		})
		const store = createStore(
			{
				initialValue: new Map<String, User>(),
			},
			context,
		)

		const user = store.getUser('1')
		const after = new Date()
		expect(user).toEqual({
			id: '1',
			name: 'Bob',
			age: 22,
		})
		expect(store.updatedTs).toBeInstanceOf(Date)
		expect(store.updatedTs?.getTime()).toBeGreaterThanOrEqual(
			before.getTime(),
		)
		expect(store.updatedTs?.getTime()).toBeLessThanOrEqual(after.getTime())

		expect(store.get('1')).toEqual({
			id: '1',
			name: 'Bob',
			age: 22,
		})
	})

	it('should create an in-memory store', () => {
		const store = createStore(
			{
				initialValue: new Map<String, User>(),
			},
			store => ({
				user: null as User | null,
				getUser(id: string): User {
					const user: User = {
						id,
						name: 'bob',
						age: 22,
					}
					this.user = user
					store.set(id, user)
					return user
				},
			}),
		)

		store.getUser('bob')
		expect(store.user?.name).toEqual('bob')
		expect(store.get('bob')?.name).toBe('bob')

		expect(store.storage).toBe(undefined)
		expect(mockedStorage.getItem).not.toHaveBeenCalled()
		expect(mockedStorage.setItem).not.toHaveBeenCalled()
	})
})
