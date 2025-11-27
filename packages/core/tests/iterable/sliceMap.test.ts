import { describe, expect, it } from 'vitest'
import { sliceMap } from '../../src'

describe('sliceMap', () => {
	it('should return empty array for non-iterable values', () => {
		expect(sliceMap(null as any)).toEqual([])
		expect(sliceMap(BigInt(99) as any)).toEqual([])
	})

	it('should ignore "empty" items', () => {
		expect(
			sliceMap(
				[
					null,
					undefined,
					NaN,
					Infinity,
					1,
					2,
					3,
					{},
					new Map(),
					[],
					{},
				],
				(x: number) => x * x,
			),
		).toEqual([1, 4, 9])
	})

	it('should slice iterables and map into array', () => {
		expect(
			sliceMap(
				new Map([
					['a', 1],
					['b', 2],
				]),
				x => x ** 2,
			),
		).toEqual([1, 4])
	})

	it('should slice iterables and map into Map', () => {
		const options = {
			asMap: true,
			end: 3,
			start: 1,
		}
		const result1 = sliceMap([1, 2, 3], options)
		expect(result1).instanceOf(Map)
		expect([...result1]).toEqual([
			[1, 2],
			[2, 3],
		])

		expect(sliceMap([1, 2, 3], x => x * x)).toEqual([1, 4, 9])
	})
})
