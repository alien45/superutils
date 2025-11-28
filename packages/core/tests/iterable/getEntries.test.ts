import { describe, expect, it } from 'vitest'
import { getEntries } from '../../src'

describe('getEntries', () => {
	it('should convert a Map to 2D array', () => {
		expect(
			getEntries(
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
		expect(getEntries(null as any)).toEqual([])
		expect(getEntries(0 as any)).toEqual([])
		expect(getEntries('' as any)).toEqual([])
	})
})
