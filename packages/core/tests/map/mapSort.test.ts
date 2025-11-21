import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mapSort } from '../../src'
import { type MapEntry, compareMap, prepareMapOfObjects } from './prepareMap'

describe('mapSort', () => {
	const prepared = prepareMapOfObjects()
	let mapOfObjectsSortedByAge: Map<number, MapEntry>
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
		const sorted = mapSort(prepared.mapOfObjects, true)
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
		const result = mapSort(prepared.mapOfObjects, comparatorFn)
		expect(comparatorFn).toHaveBeenCalledTimes(8)
		compareMap(result, mapOfObjectsSortedByAge)
	})

	it('should sort map by object property value', () => {
		const result = mapSort(prepared.mapOfObjects, 'age')
		compareMap(result, mapOfObjectsSortedByAge)
		// sorted the original map
		expect(result === prepared.mapOfObjects).toBe(true)
	})

	it('should sort orginal map instead of creating new instance', () => {
		const result2 = mapSort(prepared.mapOfObjects, 'age', {
			newInstance: true,
		})
		compareMap(result2, mapOfObjectsSortedByAge)
		expect(result2 === prepared.mapOfObjects).toBe(false)
	})

	it('should return reverse sort by map-key when object property name is not provided', () => {
		compareMap(
			mapSort(prepared.mapOfObjects, undefined as any),
			mapSort(mapOfObjectsSortedByAge, true, { reverse: true }),
		)
	})
})
