import { describe, it, expect } from 'vitest'
import { mapValues } from '../../src'

describe('mapValues', () => {
	it('should return map values as array', () => {
		expect(
			mapValues(
				new Map([
					[1, 2],
					[3, 4],
				]),
			),
		).toEqual([2, 4])
	})
	it('should return empty array when non-Map values provided', () => {
		expect(mapValues(null as any)).toEqual([])
		expect(mapValues(0 as any)).toEqual([])
		expect(mapValues('' as any)).toEqual([])
	})
})
