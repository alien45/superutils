import { describe, expect, it, vi } from 'vitest'
import { mapFilter } from '../../src'
import { type MapEntry, compareMap, prepareMapOfObjects } from './prepareMap'

describe('mapFilter', () => {
	const prepared = prepareMapOfObjects()
	it('should filter map by value', () => {
		const expected = new Map([[3, { name: 'Charlie', age: 35 }]])
		const callback = vi.fn((x: MapEntry) => x.age > 30)
		const result = mapFilter(prepared.mapOfObjects, callback, 1)
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
		const result = mapFilter(prepared.mapOfObjects, null as any)
		compareMap(result, prepared.mapOfObjects)
	})
})
