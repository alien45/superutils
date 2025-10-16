import { describe, expect, it } from 'vitest'
import { arrUnique, noop } from '../src'

describe('arrUnique', () => {
	it('should return a new array with unique elements', () => {
		const arr = [1, 2, 4, 3, 4, 5]
		expect(arrUnique(arr)).toEqual([1, 2, 4, 3, 5])
	})
})

describe('noop', () => {
	it('should return undefined', () => {
		expect(noop()).toBe(undefined)
	})
})
