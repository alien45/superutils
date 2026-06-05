import { BehaviorSubject, Subscription } from 'rxjs'
import { describe, expect, it } from 'vitest'
import { isSubscriptionLike } from '../src'

describe('isSubscriptionLike', () => {
	const subscriptionLikeObj = {
		closed: false,
		unsubscribe: () => {},
	}
	it('should return false if not subscription-like object', () => {
		expect(isSubscriptionLike(null)).toBe(false)
		expect(isSubscriptionLike(undefined)).toBe(false)
		expect(isSubscriptionLike(1)).toBe(false)
		expect(isSubscriptionLike(false)).toBe(false)
		expect(isSubscriptionLike({})).toBe(false)
		expect(isSubscriptionLike(new Map())).toBe(false)
		expect(isSubscriptionLike({})).toBe(false)
		expect(isSubscriptionLike({ unsubscribe: () => {} })).toBe(false)
		expect(isSubscriptionLike({ closed: true })).toBe(false)
		expect(isSubscriptionLike({ closed: false })).toBe(false)
	})

	it('should return true if subscription-like object', () => {
		expect(isSubscriptionLike(new Subscription())).toBe(true)
		expect(isSubscriptionLike(new BehaviorSubject(0))).toBe(true)
		expect(isSubscriptionLike(subscriptionLikeObj)).toBe(true)
	})

	it('should return false if not instance of Subscription when in strict mode', () => {
		expect(isSubscriptionLike(new BehaviorSubject(0), true)).toBe(false)
		expect(isSubscriptionLike(subscriptionLikeObj, true)).toBe(false)
	})
})
