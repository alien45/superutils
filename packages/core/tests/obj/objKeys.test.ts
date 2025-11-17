import { describe, expect, it } from 'vitest'
import { objKeys } from '../../src'

describe('objKeys', () => {
	it('should return empty array if non-object value is provided', () => {
		expect(objKeys(null as any)).toEqual([])
	})

	it('should return object property names/keys', () => {
		const d = Symbol('d')
		const obj = { c: 3, a: 1, [d]: 4, b: 2 }
		expect(objKeys(obj)).toEqual([d, 'a', 'b', 'c'])
		expect(objKeys(obj, false)).toEqual(['a', 'b', 'c'])
	})
})
