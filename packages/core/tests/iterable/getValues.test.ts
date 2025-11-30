import { describe, it, expect } from 'vitest'
import { getValues } from '../../src'

describe('getValues', () => {
	it('should return map values as array', () => {
		expect(
			getValues(
				new Map([
					[1, 2],
					[3, 4],
				]),
			),
		).toEqual([2, 4])
	})
	it('should return empty array when non-Map values provided', () => {
		expect(getValues(null as any)).toEqual([])
		expect(getValues(0 as any)).toEqual([])
		expect(getValues('' as any)).toEqual([])
	})
})
