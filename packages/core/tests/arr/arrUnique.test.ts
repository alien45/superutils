import { describe, expect, it } from 'vitest'
import { arrUnique } from '../../src'

describe('arrUnique', () => {
	it('should return a empty array when invalid values provided', () => {
		expect(arrUnique(null as any)).toEqual([])
		expect(arrUnique(undefined as any)).toEqual([])
		expect(arrUnique(new Map() as any)).toEqual([])
	})
	it('should return a new array with unique elements', () => {
		expect(arrUnique([1, 2, 4, 3, 4, 5, 1])).toEqual([1, 2, 4, 3, 5])
	})
})
