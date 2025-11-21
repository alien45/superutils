import { describe, it, expect } from 'vitest'
import { mapKeys } from '../../src'

describe('mapKeys', () => {
	it('should return map values as array', () => {
		expect(
			mapKeys(
				new Map([
					[1, 2],
					[3, 4],
				]),
			),
		).toEqual([1, 3])
	})
	it('should return empty array when non-Map values provided', () => {
		expect(mapKeys(null as any)).toEqual([])
		expect(mapKeys(0 as any)).toEqual([])
		expect(mapKeys('' as any)).toEqual([])
	})
})
