import { describe, expect, it } from 'vitest'
import { strToArr } from '../../src'

describe('strToArr', () => {
	it('should return empty array for non-string values', () => {
		expect(strToArr(null)).toEqual([])
		expect(strToArr(undefined)).toEqual([])
		expect(strToArr(new Map())).toEqual([])
		expect(strToArr({ a: 1 })).toEqual([])
		expect(strToArr(Infinity)).toEqual([])
		expect(strToArr(false)).toEqual([])
	})

	it('should convert CSV string to array', () => {
		expect(strToArr('a,b,c,d')).toEqual(['a', 'b', 'c', 'd'])
	})

	it('should convert TSV string to array', () => {
		expect(strToArr('a	b	c	d', '\t')).toEqual(['a', 'b', 'c', 'd'])
		expect(strToArr('a\tb\tc\td', '\t')).toEqual(['a', 'b', 'c', 'd'])
	})
})
