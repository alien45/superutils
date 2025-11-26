import { describe, expect, it } from 'vitest'
import { objClean } from '../../src'

describe('objClean', () => {
	it('should create a new object by recursively extracting specified properties', () => {
		const d = Symbol('d')
		const source = {
			a: 1,
			b: 2,
			c: 3,
			[d]: 4,
			e: {
				f: 6,
				g: 7,
				h: {
					i: {
						j: 99,
					},
				},
			},
			k: {
				l: 1,
				m: 2,
			},
		}
		const result = objClean(
			source,
			['a', 'c', 'z' as any, 'e.g', 'e.h.i.j', 'k'],
			true,
		)
		const expected = {
			a: 1,
			c: 3,
			e: { g: 7, h: { i: { j: 99 } } },
			k: {
				l: 1,
				m: 2,
			},
		}
		expect(result).toEqual(expected)
	})

	it('should return empty object when non-object value provided', () => {
		expect(objClean(null as any, ['a'])).toEqual({})
	})
})
