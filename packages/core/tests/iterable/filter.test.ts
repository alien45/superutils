import { describe, expect, it, vi } from 'vitest'
import { filter } from '../../src'
import { compareMap, prepareMapOfObjects } from './prepareMap'

describe('filter', () => {
	const prepared = prepareMapOfObjects()

	it('should return empty array when non-iterable value provided', () => {
		const callback = vi.fn((x: unknown) => !!x)
		const result = filter({} as any, callback)
		const expected = [] as any[]
		expect(callback).not.toHaveBeenCalled()
		expect(result).toEqual(expected)
	})

	it('should return original map when callback is not a function', () => {
		const result = filter(
			prepared.mapOfObjects,
			null as any,
			undefined,
			true,
		)
		compareMap(result, prepared.mapOfObjects)
	})

	it('should filter a Map by value and return results as Array by defualt', () => {
		const result = filter(
			prepared.mapOfObjects,
			({ name }) => name === 'Alice',
			1,
		)
		const expected = [{ age: 30, name: 'Alice' }]
		expect(result).toEqual(expected)
	})

	it('should filter a Map by value and return results as Map', () => {
		const result = filter(
			prepared.mapOfObjects,
			({ name }) => name === 'Alice',
			1,
			true,
		)
		const expected = [['alice', { age: 30, name: 'Alice' }]]
		expect([...result.entries()]).toEqual(expected)
	})

	it('should filter an array and return a map with indexes as keys', () => {
		const result = filter(
			[...prepared.mapOfObjects.values()],
			({ age }) => age > 0,
			100,
			true,
		)
		compareMap(
			result,
			new Map([...prepared.mapOfObjects.values()].map((v, i) => [i, v])),
		)
	})
})
