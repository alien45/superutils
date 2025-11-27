import { describe, expect, it } from 'vitest'
import { getSize } from '../../src'

describe('getSize', () => {
	it('should return 0 for non-iterables', () => {
		expect(getSize(null as any)).toBe(0)
		expect(getSize({} as any)).toBe(0)
		expect(getSize(BigInt(99) as any)).toBe(0)
	})
	it('should return size of iterables', () => {
		expect(
			getSize(
				new Map([
					[1, 1],
					[2, 2],
				]),
			),
		).toBe(2)
		expect(getSize([1, 2, 3])).toBe(3)
		expect(getSize(new Set([1, 2, 3, 1]))).toBe(3)
		expect(getSize(new Uint8Array([1, 2]))).toBe(2)
	})
})
