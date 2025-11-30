import { describe, it, expect } from 'vitest'
import { getKeys } from '../../src'

describe('getKeys', () => {
	it('should return map values as array', () => {
		expect(
			getKeys(
				new Map([
					[1, 2],
					[3, 4],
				]),
			),
		).toEqual([1, 3])
	})
	it('should return empty array when non-Map values provided', () => {
		expect(getKeys(null as any)).toEqual([])
		expect(getKeys(0 as any)).toEqual([])
		expect(getKeys('' as any)).toEqual([])
	})
})
