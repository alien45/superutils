import { describe, expect, it } from 'vitest'
import { objKeys } from '../../src'

describe('objKeys', () => {
	it('should return empty array if non-object value is provided', () => {
		expect(objKeys(null as any)).toEqual([])
		expect(objKeys(undefined as any)).toEqual([])
	})

	it('should return sorted object property names without symbols', () => {
		const sym = Symbol('d')
		const obj = { c: 3, a: 1, [sym]: 4, b: 2 }
		expect(objKeys(obj, true, false)).toEqual(['a', 'b', 'c'])
		const map = new Map()
		;(map as any).test = 1
		;(map as any)[sym] = 2
		expect(objKeys(map, true, false)).toEqual(['test'])
	})

	it('should return unsorted object property names/keys with symbols at the beginning', () => {
		const sym = Symbol('d')
		const obj = { c: 3, a: 1, [sym]: 4, b: 2 }
		expect(objKeys(obj, false)).toEqual([sym, 'c', 'a', 'b'])
		const map = new Map()
		;(map as any).test2 = 1
		;(map as any).test = 1
		;(map as any)[sym] = 2
		expect(objKeys(map, false)).toEqual([sym, 'test2', 'test'])
	})
})
