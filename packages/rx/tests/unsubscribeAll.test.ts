import { BehaviorSubject, Subscription } from 'rxjs'
import { describe, expect, it, vi } from 'vitest'
import { unsubscribeAll } from '../src'

describe('unsubscribeAll', () => {
	const subjects = new Array(100).fill(0).map(() => new BehaviorSubject(0))

	it('should ignore non-subjects silently', () => {
		const subs = {
			null: null,
			undefined: undefined,
			1: 1,
			map: new Map(),
			obj: { a: 1 },
			arr: [1, 2, 3],
		}
		expect(() => unsubscribeAll(subs)).not.toThrow()
		expect(() => unsubscribeAll(undefined)).not.toThrow()
		expect(() => unsubscribeAll(null)).not.toThrow()
		expect(() => unsubscribeAll(false)).not.toThrow()
		expect(() => unsubscribeAll(true)).not.toThrow()
	})

	it('should invoke single unsubscribe function', () => {
		const func = vi.fn()
		unsubscribeAll(func)
		expect(func).toHaveBeenCalledOnce()
	})

	it('should unsubscribe from a single subscription', () => {
		const sub = subjects[0].subscribe()
		unsubscribeAll(sub)
		expect(sub.closed).toBe(true)
		expect(subjects[0].closed).toBe(false)
	})

	it('should unsubscribe from array of subscriptions', () => {
		const subs = subjects.map(subject => subject.subscribe())
		unsubscribeAll(subs)
		expect(subs.every(sub => sub.closed)).toBe(true)

		const s = [vi.fn(), null, subjects[0].subscribe()]
		unsubscribeAll(s)
	})

	it('should unsubscribe from object containing subscriptions', () => {
		const subs = subjects.reduce(
			(obj, subject, i) => {
				obj[`${i}`] = subject.subscribe()
				return obj
			},
			{} as Record<string, Subscription>,
		)
		unsubscribeAll(subs)
		expect(Object.values(subs).every(sub => sub.closed)).toBe(true)
	})

	it('should unsubscribe from all subscriptions in an object and invoke callbacks', () => {
		const subs = subjects.slice(0, 50).reduce(
			(obj, subject, i) => {
				obj[`${i}`] = subject.subscribe()
				return obj
			},
			{} as Record<string, unknown>,
		)
		subs.arr = subjects.slice(50).map(s => s.subscribe())
		subs.func = vi.fn()
		subs.funcs = [vi.fn(), vi.fn()]
		unsubscribeAll(subs)
		const checkClosed = (sub: unknown) =>
			(sub as Subscription)?.closed ?? true // return true if not a subscription
		const allClosed = Object.values(subs).every(sub =>
			Array.isArray(sub)
				? sub.every(s => checkClosed(s))
				: checkClosed(sub),
		)
		expect(allClosed).toBe(true)
		expect(subs.func).toHaveBeenCalledOnce()
		;(subs.funcs as Function[]).every(f => expect(f).toHaveBeenCalledOnce())
	})

	it('should catch errors and invoke onError callback', () => {
		const onError = vi.fn()
		const func = vi.fn(() => {
			throw new Error('error')
		})
		unsubscribeAll(func, onError)
		expect(onError).toHaveBeenCalledOnce()
		expect(func).toHaveBeenCalledOnce()
	})
})
