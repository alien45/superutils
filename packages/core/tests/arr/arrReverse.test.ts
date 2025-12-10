import { describe, expect, it } from 'vitest'
import { arrReverse } from '../../src'

describe('arrReverse', () => {
	it('should return empty array for non-array values', () => {
		expect(arrReverse(null as any)).toEqual([])
		expect(arrReverse(new Map() as any)).toEqual([])
		expect(arrReverse(new Set() as any)).toEqual([])
		expect(arrReverse(new Uint8Array() as any)).toEqual([])
	})
	it('should return a new array with reversed elements', () => {
		expect(arrReverse([1, 2, 4], true, true)).toEqual([4, 2, 1])
	})
	it('should return a original array when "newArray" param is false', () => {
		const arr = [1, 2, 3]
		const notReversed = arrReverse(arr, false, false)
		expect(notReversed === arr).toBe(true)
		expect(notReversed).toEqual([1, 2, 3])

		const reversed = arrReverse(arr, true, false)
		expect(reversed === arr).toBe(true)
		expect(reversed).toEqual([3, 2, 1])
	})
})
