import { describe, expect, it } from 'vitest'
import { isMap, isMapObj } from '../../src'

describe('isMap', () => {
	it('should return true for Map', () => {
		expect(isMap(new Map())).toBe(true)
		expect(isMap(new Map([[1, 2]]))).toBe(true)
	})
	it('should return false for non-Map values', () => {
		expect(isMap(new WeakMap())).toBe(false)
		expect(isMap({})).toBe(false)
	})
})

describe('isMapObj', () => {
	const mapStrict = new Map<unknown, unknown>([
		[1, {}],
		[1, { a: { b: 2 } }],
		[2, Object.create(null)],
	])
	const mapNonStrict = new Map<unknown, unknown>([
		[1, {}],
		[2, [1, 3]],
		[3, new WeakMap([[{ a: 1 }, {}]])],
		[4, new Error()],
		[5, new Set()],
		[6, []],
	])

	it('should return false for non-object values or empty map', () => {
		const invalidValues = [new WeakMap(), {}, null, undefined, 1, '', false]
		expect(invalidValues.every(x => !isMapObj(x, true))).toBe(true)
		expect(invalidValues.every(x => !isMapObj(x, false))).toBe(true)
		expect(isMapObj(mapNonStrict, true)).toBe(false)
	})

	it('should return true for Map with objects values', () => {
		expect(isMapObj(mapStrict, true)).toBe(true)
		expect(isMapObj(mapStrict, false)).toBe(true)
		expect(isMapObj(mapNonStrict, false)).toBe(true)
	})

	it('should return true for Map with objects values', () => {
		expect(isMapObj(mapStrict, true)).toBe(true)
		expect(isMapObj(mapStrict, false)).toBe(true)
		expect(isMapObj(mapNonStrict, false)).toBe(true)
	})
})
