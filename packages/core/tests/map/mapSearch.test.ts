import { describe, it, expect } from 'vitest'
import { mapSearch, mapFind } from '../../src'
import { compareMap, MapEntry, prepareMapOfObjects } from './prepareMap'

describe('mapSearch', () => {
	const prepared = prepareMapOfObjects()

	it('should find first item matching partial value', () => {
		const result = mapSearch(prepared.mapOfObjects, {
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
		const result = mapSearch(prepared.mapOfObjects, {
			query: { name: 'ali' },
			ignoreCase: false,
			matchExact: false,
		})
		expect(result.size).toBe(0)
	})

	it('should limit number of results', () => {
		const result = mapSearch(prepared.mapOfObjects, {
			query: { name: 'e' },
			limit: 1,
			matchExact: false,
		})
		const expected = new Map([[1, { age: 30, name: 'Alice' }]])
		compareMap(result, expected)
	})

	it('should return empty map when no match found', () => {
		const result = mapSearch(prepared.mapOfObjects, {
			query: { name: 'Zoe' },
		})
		expect(result.size).toBe(0)
	})

	it('should accept RegExp as keyword', () => {
		const result = mapSearch(prepared.mapOfObjects, {
			query: { name: /^ali/i },
		})
		const expected = new Map([[1, { age: 30, name: 'Alice' }]])
		compareMap(result, expected)
	})

	it('should allow searching an array and return a map', () => {
		const arrOfObjects = Array.from(prepared.mapOfObjects.values())
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
