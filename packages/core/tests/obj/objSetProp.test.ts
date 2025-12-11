import { describe, expect, it } from 'vitest'
import { objSetProp, objSetPropUndefined } from '../../src'

describe('objSetProp', () => {
	it('should return empty object if non-object value is provided', () => {
		expect(objSetProp(null as any, 'a')).toEqual({})
	})

	it('should set an object property value', () => {
		expect(objSetProp({ c: 3, a: 1 }, 'b', 2)).toEqual({
			a: 1,
			b: 2,
			c: 3,
		})
	})

	it('should set an object property value conditionally', () => {
		let count = 0
		const condition = () => ++count % 2 === 0
		expect(objSetProp({ c: 3, a: 1 }, 'b', 2, condition, 4)).toEqual({
			a: 1,
			b: 2,
			c: 3,
		})
		expect(objSetProp({ c: 3, a: 1 }, 'b', 2, condition, 4)).toEqual({
			a: 1,
			b: 4,
			c: 3,
		})
	})
})

describe('objSetPropUndefined', () => {
	it('should set an object property value', () => {
		expect(objSetPropUndefined({ c: 3, a: 1 }, 'b', 2)).toEqual({
			a: 1,
			b: 2,
			c: 3,
		})
	})
	it('should ignore when object property value is not undefined', () => {
		expect(objSetPropUndefined({ a: 1, b: 2, c: 3 }, 'b', 4)).toEqual({
			a: 1,
			b: 2,
			c: 3,
		})
	})
})
