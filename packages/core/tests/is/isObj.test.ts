import { describe, expect, it } from 'vitest'
import { isObj } from '../../src'

describe('isObj', () => {
	class CustomClass {
		value = 'some value'
	}
	it('should return true for object literals in strict mode', () => {
		expect(isObj({})).toBe(true)
		expect(isObj({ a: 1 })).toBe(true)
		expect(isObj(Object.create(null))).toBe(true)
	})
	it('should return false for non-object-literals in strict mode', () => {
		expect(isObj([])).toBe(false)
		expect(isObj(new Map())).toBe(false)
		expect(isObj(new Set())).toBe(false)
		expect(isObj(new Date())).toBe(false)
		expect(isObj(new RegExp(''))).toBe(false)
		expect(isObj(new Error())).toBe(false)
		expect(isObj(new CustomClass())).toBe(false)
	})
	it('should return true for non-object-literals when strict mode is off', () => {
		expect(isObj([], false)).toBe(true)
		expect(isObj(new Map(), false)).toBe(true)
		expect(isObj(new Set(), false)).toBe(true)
		expect(isObj(new Date(), false)).toBe(true)
		expect(isObj(new RegExp(''), false)).toBe(true)
		expect(isObj(new Error(), false)).toBe(true)
		expect(isObj(new CustomClass(), false)).toBe(true)
	})
	it('should alwasy return false regardless of strict mode', () => {
		expect(isObj(undefined)).toBe(false)
		expect(isObj(undefined, false)).toBe(false)
		expect(isObj(null)).toBe(false)
		expect(isObj(null, false)).toBe(false)
		expect(isObj(Infinity)).toBe(false)
		expect(isObj(Infinity, false)).toBe(false)
		expect(isObj(NaN)).toBe(false)
		expect(isObj(NaN, false)).toBe(false)
	})
})
