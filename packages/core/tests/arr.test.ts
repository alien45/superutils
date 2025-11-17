import { describe, expect, it } from 'vitest'
import { arrReverse, arrUnique } from '../src'

describe('arr', () => {
	describe('arrUnique', () => {
		it('should return a new array with unique elements', () => {
			expect(arrUnique([1, 2, 4, 3, 4, 5])).toEqual([1, 2, 4, 3, 5])
		})
	})

	describe('arrReverse', () => {
		it('should return a new array with reversed elements', () => {
			expect(arrReverse([1, 2, 4])).toEqual([4, 2, 1])
		})
	})
})
