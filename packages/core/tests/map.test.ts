import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
	mapFilter,
	mapFind,
	mapJoin,
	mapSearch,
	mapSort,
	mapEntries,
	mapValues,
} from '../src'

describe('map', () => {
	type MapEntry = { age: number; name: string }
	let mapOfObjects: Map<number, MapEntry>
	const compareMap = (map: Map<any, any>, expected: Map<any, any>) =>
		expect(mapEntries(map)).toEqual(mapEntries(expected))

	afterEach(() => {
		mapOfObjects.clear()
	})

	beforeEach(() => {
		mapOfObjects = new Map([
			[1, { age: 30, name: 'Alice' }],
			[2, { age: 25, name: 'Bob' }],
			[3, { age: 35, name: 'Charlie' }],
			[4, { age: 28, name: 'Dave' }],
			[5, { age: 22, name: 'Eve' }],
		])
	})

	describe('mapEntries', () => {
		it('should convert a Map to 2D array', () => {
			expect(mapEntries(mapOfObjects)).toEqual([
				...mapOfObjects.entries(),
			])
		})
		it('should return empty array when non-Map values provided', () => {
			expect(mapEntries(null as any)).toEqual([])
			expect(mapEntries(0 as any)).toEqual([])
			expect(mapEntries('' as any)).toEqual([])
		})
	})

	describe('mapFilter', () => {
		it('should filter map by value', () => {
			const expected = new Map([[3, { name: 'Charlie', age: 35 }]])
			const callback = vi.fn((x: MapEntry) => x.age > 30)
			const result = mapFilter(mapOfObjects, callback, 1)
			expect(callback).toHaveBeenCalledTimes(3)
			compareMap(result, expected)
		})

		it('should return empty map when non-map value provided', () => {
			const expected = new Map([])
			const callback = vi.fn((x: unknown) => !!x)
			const result = mapFilter({} as any, callback)
			expect(callback).not.toHaveBeenCalled()
			compareMap(result, expected)
		})

		it('should return original map when callback is not a function', () => {
			const result = mapFilter(mapOfObjects, null as any)
			compareMap(result, mapOfObjects)
		})
	})

	describe('mapFind', () => {
		it('should find object-item by key and value', () => {
			const result = mapFind(mapOfObjects, {
				query: { name: 'Bob' },
				matchExact: true,
				includeKey: true,
			})
			expect(result).toEqual([2, { name: 'Bob', age: 25 }])
		})

		it('should find first item matching partial value', () => {
			const result = mapFind(mapOfObjects, {
				query: { name: 'Eve' },
				matchExact: true,
			})
			expect(result).toEqual({ age: 22, name: 'Eve' })
		})
	})

	describe('mapJoin', () => {
		it('should join multiple maps into one', () => {
			const map1 = new Map([
				['a', 1],
				['b', 2],
			])
			const map2 = new Map([
				['c', 3],
				['d', 4],
			])
			const result = mapJoin(map1, map2)
			const expected = new Map([
				['a', 1],
				['b', 2],
				['c', 3],
				['d', 4],
			])
			compareMap(result, expected)
		})

		it('should join a mix of maps and arrays into a single map', () => {
			const entries: [string, number][] = [
				['x', 10],
				['y', 20],
			]
			const map = new Map([
				['a', 1],
				['b', 2],
			])
			const entries2: [string, number][] = [
				['m', 100],
				['n', 200],
			]
			const result = mapJoin(entries, map, entries2)
			const expected = new Map([
				['x', 10],
				['y', 20],
				['a', 1],
				['b', 2],
				['m', 100],
				['n', 200],
			])
			compareMap(result, expected)
		})

		it('should return empty map when no valid maps or arrays provided', () => {
			const result = mapJoin(...([{}, [], null, 'str', 2, false] as any))
			expect(result.size).toBe(0)
		})
	})

	describe('mapSearch', () => {
		it('should find first item matching partial value', () => {
			const result = mapSearch(mapOfObjects, {
				query: { name: 've' },
				matchExact: false,
			})
			const expected = new Map([
				[4, { age: 28, name: 'Dave' }],
				[5, { age: 22, name: 'Eve' }],
			])
			compareMap(result, expected)
		})

		it('should respect ignoreCase option', () => {
			const result = mapSearch(mapOfObjects, {
				query: { name: 'ali' },
				ignoreCase: false,
				matchExact: false,
			})
			expect(result.size).toBe(0)
		})

		it('should limit number of results', () => {
			const result = mapSearch(mapOfObjects, {
				query: { name: 'e' },
				limit: 1,
				matchExact: false,
			})
			const expected = new Map([[1, { age: 30, name: 'Alice' }]])
			compareMap(result, expected)
		})

		it('should return empty map when no match found', () => {
			const result = mapSearch(mapOfObjects, {
				query: { name: 'Zoe' },
			})
			expect(result.size).toBe(0)
		})

		it('should accept RegExp as keyword', () => {
			const result = mapSearch(mapOfObjects, {
				query: { name: /^ali/i },
			})
			const expected = new Map([[1, { age: 30, name: 'Alice' }]])
			compareMap(result, expected)
		})

		it('should allow searching an array and return a map', () => {
			const arrOfObjects = Array.from(mapOfObjects.values())
			const result = mapSearch(arrOfObjects, {
				query: { name: 'a' },
				matchExact: false,
			})

			const expected = new Map<number, MapEntry>([
				[0, { age: 30, name: 'Alice' }],
				[2, { age: 35, name: 'Charlie' }],
				[3, { age: 28, name: 'Dave' }],
			])
			compareMap(result, expected)
		})

		it('should return undefined when map or conf is unexpected value', () => {
			const result = mapFind(null as any, null as any)
			expect(result).toEqual(undefined)
		})
	})

	describe('mapSort', () => {
		let mapOfObjectsSortedByAge: Map<number, MapEntry>
		afterEach(() => {
			mapOfObjectsSortedByAge.clear()
		})
		beforeEach(() => {
			mapOfObjectsSortedByAge = new Map([
				[5, { age: 22, name: 'Eve' }],
				[2, { age: 25, name: 'Bob' }],
				[4, { age: 28, name: 'Dave' }],
				[1, { age: 30, name: 'Alice' }],
				[3, { age: 35, name: 'Charlie' }],
			])
		})

		it('should return empty map when non-map value provided', () => {
			const result = mapSort({} as any, '')
			expect(result.size).toBe(0)
			compareMap(result, new Map())
		})

		it('should sort map of simple values', () => {
			const mapOfNumbers = new Map([
				['a', 5],
				['b', 2],
				['c', 8],
				['d', 1],
			])
			const result = mapSort(mapOfNumbers)
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
			const result = mapSort(mapOfNumbers, {
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
			const sorted = mapSort(mapOfObjects, true)
			const expected = new Map(
				mapEntries(mapOfObjects).sort((a, b) => a[0] - b[0]),
			)
			compareMap(sorted, expected)
		})

		it('should sort map by value using comparator function', () => {
			const comparatorFn = vi.fn(
				(a: [number, MapEntry], b: [number, MapEntry]) =>
					a[1].age - b[1].age,
			)
			const result = mapSort(mapOfObjects, comparatorFn)
			expect(comparatorFn).toHaveBeenCalledTimes(8)
			compareMap(result, mapOfObjectsSortedByAge)
		})

		it('should sort map by object property value', () => {
			const result = mapSort(mapOfObjects, 'age')
			compareMap(result, mapOfObjectsSortedByAge)
			// sorted the original map
			expect(result === mapOfObjects).toBe(true)
		})

		it('should sort orginal map instead of creating new instance', () => {
			const result2 = mapSort(mapOfObjects, 'age', { newInstance: true })
			compareMap(result2, mapOfObjectsSortedByAge)
			expect(result2 === mapOfObjects).toBe(false)
		})

		it('should return reverse sort by map-key when object property name is not provided', () => {
			compareMap(
				mapSort(mapOfObjects, undefined as any),
				mapSort(mapOfObjectsSortedByAge, true, { reverse: true }),
			)
		})
	})

	describe('mapValues', () => {
		it('should return map values as array', () => {
			expect(mapValues(mapOfObjects)).toEqual([...mapOfObjects.values()])
		})
		it('should return empty array when non-Map values provided', () => {
			expect(mapValues(null as any)).toEqual([])
			expect(mapValues(0 as any)).toEqual([])
			expect(mapValues('' as any)).toEqual([])
		})
	})
})
