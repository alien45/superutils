import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { randomInt, sort } from '../../src'
import {
	type MapEntry,
	compareMap,
	prepareMapOfObjects,
} from '../map/prepareMap'

describe('sort', () => {
	const prepared = prepareMapOfObjects()
	let mapOfObjectsSortedByAge: Map<number, MapEntry>

	// console.log('benchmark sorting map by value-key')
	// const perf = (tag = '', func: () => unknown) => {
	// 	console.time(tag)
	// 	func()
	// 	console.timeEnd(tag)
	// }
	// const max = 100_000
	// const arr = new Array(max).fill(0).map(() => ({ key: `${randomInt(max)}` }))
	// for (let i = 0; i < 1; i++) {
	// 	let map = new Map(arr.map(x => [x, x]))
	// 	perf('sort(): map', () => sort(map, 'key'))
	// 	map = new Map(arr.map(x => [x, x]))
	// 	perf('sort(): map comparator', () =>
	// 		sort(map, (a, b) =>
	// 			`${a[1].key}`.toLowerCase() > `${b[1].key}`.toLowerCase()
	// 				? 1
	// 				: -1,
	// 		),
	// 	)
	// 	map = new Map(arr.map(x => [x, x]))
	// 	perf('entries.sort(): map', () =>
	// 		[...map.entries()].sort((a, b) =>
	// 			`${a[1].key}`.toLowerCase() > `${b[1].key}`.toLowerCase()
	// 				? 1
	// 				: -1,
	// 		),
	// 	)
	// }
	afterEach(() => {
		mapOfObjectsSortedByAge.clear()
	})
	beforeEach(() => {
		mapOfObjectsSortedByAge = new Map<number, MapEntry>(
			[...prepared.mapOfObjects.entries()].sort(
				(a, b) => a[1].age - b[1].age,
			),
		)
	})

	it('should return empty map when non-map value provided', () => {
		expect(sort({} as any, '')).toEqual({})
	})

	describe('array', () => {
		it('should sort arrays', () => {
			expect(sort([3, 1, 2])).toEqual([1, 2, 3])
			expect(sort(['3', '1', '2'])).toEqual(['1', '2', '3'])
		})

		it('should return sort and reverse original array', () => {
			const arrOriginal = [3, 1, 2]
			const result = sort(arrOriginal, { reverse: true })
			expect(result).toEqual([3, 2, 1])
			expect(result).toBe(arrOriginal)
		})

		it('should return sort and create a new array', () => {
			const arrOriginal = [3, 1, 2]
			const result = sort(arrOriginal, { newInstance: true })
			expect(result).toEqual([1, 2, 3])
			expect(result).not.toEqual(arrOriginal)
		})
	})

	describe('map', () => {
		it('should sort map of simple values', () => {
			const mapOfNumbers = new Map([
				['a', 5],
				['b', 2],
				['c', 8],
				['d', 1],
			])
			const result = sort(mapOfNumbers)
			const expected = new Map([
				['d', 1],
				['b', 2],
				['a', 5],
				['c', 8],
			])
			compareMap(result, expected)
			// sorted the original map
			expect(result === mapOfNumbers).toBe(true)
		})

		it('should place null/undefined values at the begining', () => {
			const mapOfNumbers = new Map([
				['a', 5],
				['b', 2],
				['c', 8],
				['d', null as any],
				['e', undefined],
				['f', null],
			])
			const result = sort(mapOfNumbers, {
				undefinedFirst: true,
			})
			const expected = new Map([
				['f', null],
				['e', undefined],
				['d', null],
				['b', 2],
				['a', 5],
				['c', 8],
			])
			compareMap(result, expected)
		})

		it('should sort by map-key when "byKey" is true', () => {
			const sorted = sort(prepared.mapOfObjects, true)
			const expected = new Map(
				[...prepared.mapOfObjects].sort((a, b) => a[0] - b[0]),
			)
			compareMap(sorted, expected)
		})

		it('should sort map by value using comparator function', () => {
			const comparatorFn = vi.fn(
				(a: [number, MapEntry], b: [number, MapEntry]) =>
					a[1].age - b[1].age,
			)
			const result = sort(prepared.mapOfObjects, comparatorFn)
			expect(comparatorFn).toHaveBeenCalledTimes(8)
			compareMap(result, mapOfObjectsSortedByAge)
		})

		it('should sort map by object property value', () => {
			const result = sort(prepared.mapOfObjects, 'age')
			compareMap(result, mapOfObjectsSortedByAge)
			// sorted the original map
			expect(result === prepared.mapOfObjects).toBe(true)
		})

		it('should sort orginal map instead of creating new instance', () => {
			const result2 = sort(prepared.mapOfObjects, 'age', {
				newInstance: true,
			})
			compareMap(result2, mapOfObjectsSortedByAge)
			expect(result2 === prepared.mapOfObjects).toBe(false)
		})

		it('should return reverse sort by map-key when object property name is not provided', () => {
			compareMap(
				sort(prepared.mapOfObjects, undefined as any),
				sort(mapOfObjectsSortedByAge, true, { reverse: true }),
			)
		})
	})

	describe('set', () => {
		it('should sort sets', () => {
			expect([...sort(new Set([3, 1, 2]))]).toEqual([1, 2, 3])
		})

		it('should return sort and reverse original array', () => {
			const arrOriginal = [3, 1, 2]
			const result = sort(arrOriginal, { reverse: true })
			expect(result).toEqual([3, 2, 1])
			expect(result).toBe(arrOriginal)
		})

		it('should return sort and create a new array', () => {
			const arrOriginal = [3, 1, 2]
			const result = sort(arrOriginal, { newInstance: true })
			expect(result).toEqual([1, 2, 3])
			expect(result).not.toEqual(arrOriginal)
		})
	})
})
