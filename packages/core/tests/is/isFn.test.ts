import { describe, expect, it } from 'vitest'
import { isAsyncFn, isFn } from '../../src'

describe('isAsyncFn', () => {
	it('should return true for async functions', () => {
		expect(isAsyncFn(async () => {})).toBe(true)
		expect(isAsyncFn(async function () {})).toBe(true)
	})
	it('should return false for non-async functions', () => {
		expect(isAsyncFn(() => {})).toBe(false)
		expect(isAsyncFn(() => Promise.resolve(0))).toBe(false)
		expect(isAsyncFn(function () {})).toBe(false)
		expect(
			isAsyncFn(function () {
				return Promise.resolve(0)
			}),
		).toBe(false)
		expect(isAsyncFn({})).toBe(false)
	})
})
describe('isFn', () => {
	it('should return true for functions', () => {
		expect(isFn(() => {})).toBe(true)
		expect(isFn(function () {})).toBe(true)
	})
	it('should return false for non-functions', () => {
		expect(isFn({})).toBe(false)
		expect(isFn(123)).toBe(false)
	})
})
