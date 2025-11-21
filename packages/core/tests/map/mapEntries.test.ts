import { describe, expect, it } from 'vitest'
import { mapEntries } from '../../src'

describe('mapEntries', () => {
	it('should convert a Map to 2D array', () => {
		expect(
			mapEntries(
				new Map([
					[1, 1],
					[2, 2],
				]),
			),
		).toEqual([
			[1, 1],
			[2, 2],
		])
	})
	it('should return empty array when non-Map values provided', () => {
		expect(mapEntries(null as any)).toEqual([])
		expect(mapEntries(0 as any)).toEqual([])
		expect(mapEntries('' as any)).toEqual([])
	})
})
