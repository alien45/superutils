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

	it('should create a store with context object', () => {
		const before = new Date()
		const store = createStore(null, {
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
		const store = createStore(null, {
			context,
			initialValue: new Map<String, User>(),
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

		expect(store.get('1')).toEqual({
			id: '1',
			name: 'Bob',
			age: 22,
		})
	})
})
