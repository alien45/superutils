import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { sort } from '../../src'
import {
	type MapEntry,
	type MapKey,
	compareMap,
	prepareMapOfObjects,
} from './prepareMap'

describe('sort', () => {
	const prepared = prepareMapOfObjects()
	let mapOfObjectsSortedByAge: Map<MapKey, MapEntry>
	afterEach(() => {
		mapOfObjectsSortedByAge.clear()
	})
	beforeEach(() => {
		mapOfObjectsSortedByAge = new Map<MapKey, MapEntry>(
			[...prepared.mapOfObjects.entries()].sort(
				(a, b) => a[1].age - b[1].age,
			),
		)
	})

	it('should return original when non-map value provided', () => {
		expect(sort({} as any, '')).toEqual({})
		expect(sort(null as any, '')).toEqual(null)
		expect(sort(1 as any, '')).toEqual(1)
		expect(sort(false as any, '')).toEqual(false)
	})

	describe('array', () => {
		it('should sort arrays', () => {
			expect(sort([3, 1, 2])).toEqual([1, 2, 3])
			expect(sort(['c', 'a', 'b'])).toEqual(['a', 'b', 'c'])
			expect(sort(['A', 'a', 'B', 'c'], { ignoreCase: false })).toEqual([
				'A',
				'B',
				'a',
				'c',
			])
		})

		it('should sort arrays with comparator function', () => {
			expect(sort([3, 1, 2], (a, b) => b - a)).toEqual([3, 2, 1])
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

		it('should sort map of objects by number value (asString = false)', () => {
			const result = sort(prepared.mapOfObjects, 'age', {
				asString: false,
			})
			compareMap(result, mapOfObjectsSortedByAge)
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
				[...prepared.mapOfObjects].sort((a, b) =>
					a[0] > b[0] ? 1 : -1,
				),
			)
			compareMap(sorted, expected)
		})

		it('should sort map by value using comparator function', () => {
			const comparatorFn = vi.fn(
				(a: [MapKey, MapEntry], b: [MapKey, MapEntry]) =>
					a[1].age - b[1].age,
			)
			const result = sort(prepared.mapOfObjects, comparatorFn)
			expect(comparatorFn).toHaveBeenCalled()
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
			const set = new Set([3, 1, 2])
			expect([...sort(set)]).toEqual([1, 2, 3])

			const newSet = sort(set, { newInstance: true })
			expect([...newSet]).toEqual([1, 2, 3])
			expect(newSet).not.toBe(set)
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
