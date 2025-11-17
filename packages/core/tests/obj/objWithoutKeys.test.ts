import { describe, expect, it } from 'vitest'
import { objWithoutKeys } from '../../src'

describe('objWithoutKeys', () => {
	it('should remove specified properties from object', () => {
		const obj1 = {
			a: 1,
			b: 2,
			c: 3,
			d: 4,
		}
		const obj2 = { e: 5, f: 6, g: 7 }
		const unwantedKeys = ['a', 'c', 'f']
		const result = objWithoutKeys(obj1, unwantedKeys, obj2)
		expect(result).toEqual({
			b: 2,
			d: 4,
			e: 5,
			g: 7,
		})
	})

	it('should return empty object if non-object provided', () => {
		expect(objWithoutKeys(null as any, [])).toEqual({})
	})

	it('should do nothing if non-array or empty array provided as key', () => {
		const obj = { a: 1, b: 2 }
		expect(objWithoutKeys(obj, [])).toEqual(obj)
		expect(objWithoutKeys(obj, null as any)).toEqual(obj)
	})
})
