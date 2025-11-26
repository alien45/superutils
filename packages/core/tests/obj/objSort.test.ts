import { describe, expect, it } from 'vitest'
import { objSort } from '../../src'

describe('objSort', () => {
	it('should return empty object if non-object value is provided', () => {
		expect(objSort(null as any)).toEqual({})
	})

	it('should sort an object by keys', () => {
		const d = Symbol('d')
		const obj = { c: 3, a: 1, [d]: 4, b: 2, e: { g: 1, f: 2 } }
		expect(objSort(obj)).toEqual({
			a: 1,
			b: 2,
			c: 3,
			[d]: 4,
			e: { f: 2, g: 1 },
		})
	})
})
