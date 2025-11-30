import { describe, expect, it, vi } from 'vitest'
import { filter } from '../../src'
import { type MapEntry, compareMap, prepareMapOfObjects } from './prepareMap'

describe('filter', () => {
	const prepared = prepareMapOfObjects()

	it('should return empty map when non-map value provided', () => {
		const callback = vi.fn((x: unknown) => !!x)
		const result = filter({} as any, callback)
		const expected = new Map()
		expect(callback).not.toHaveBeenCalled()
		compareMap(result, expected)
	})

	it('should filter map by value', () => {
		const result = filter(
			prepared.mapOfObjects,
			({ name }) => name === 'Alice',
			1,
		)
		const expected = new Map([[1, { age: 30, name: 'Alice' }]])
		compareMap(result, expected)
	})

	it('should return original map when callback is not a function', () => {
		const result = filter(prepared.mapOfObjects, null as any)
		compareMap(result, prepared.mapOfObjects)
	})
})
