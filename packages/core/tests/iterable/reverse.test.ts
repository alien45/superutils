import { describe, expect, it } from 'vitest'
import { reverse } from '../../src'

describe('reverse', () => {
	it('should return empty array if not array/map/set', () => {
		expect(reverse(null as any)).toEqual([])
		expect(reverse(undefined as any)).toEqual([])
	})

	describe('Array', () => {
		it('should return a new array with reversed elements', () => {
			expect(reverse([1, 2, 4])).toEqual([4, 2, 1])
		})

		it('should return a original array when "newArray" param is false', () => {
			const arr = [1, 2, 3]
			const notReversed = reverse(arr, false, false)
			expect(notReversed).toBe(arr)
			expect(notReversed).toEqual([1, 2, 3])

			const reversed = reverse(arr, true, true)
			expect(reversed).not.toBe(arr)
			expect(reversed).toEqual([3, 2, 1])
		})
	})

	describe('Map', () => {
		it('should reverse map elements and return new instance', () => {
			const map = new Map([
				[1, 2],
				[3, 4],
			])
			const result = reverse(map, true, true)
			expect(result).instanceOf(Map)
			expect(result).not.toBe(map)
			expect([...result.entries()]).toEqual([
				[3, 4],
				[1, 2],
			])
		})

		it('should reverse map elements and preserve instance', () => {
			const map = new Map([
				[1, 2],
				[3, 4],
			])
			const result = reverse(map, true, false)
			expect(result).instanceOf(Map)
			expect(result).toBe(map)
			expect([...result.entries()]).toEqual([
				[3, 4],
				[1, 2],
			])
		})
	})

	describe('Set', () => {
		it('should reverse Set elements and return new instance', () => {
			const set = new Set([1, 2, 4])
			const result = reverse(set, true, true)
			expect([...result]).toEqual([4, 2, 1])
			expect(result).instanceOf(Set)
			expect(result).not.toBe(set)
		})
		
		it('should reverse Set elements and preserve instance', () => {
			const set = new Set([1, 2, 4])
			const result = reverse(set, true, false)
			expect([...result]).toEqual([4, 2, 1])
			expect(result).instanceOf(Set)
			expect(result).toBe(set)
		})
	})
})
