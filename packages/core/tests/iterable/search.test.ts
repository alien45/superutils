import { describe, it, expect } from 'vitest'
import { search, mapFind } from '../../src'
import { compareMap, MapEntry, prepareMapOfObjects } from '../map/prepareMap'

describe('search', () => {
	const prepared = prepareMapOfObjects()

	it('should return undefined when map or conf is unexpected value', () => {
		const result = mapFind(null as any, null as any)
		expect(result).toEqual(undefined)
	})

	describe('map', () => {
		it('should return empty map when invalid', () => {
			const result = search(prepared.mapOfObjects, {
				query: { name: 'ali' },
				ignoreCase: false,
				matchExact: false,
			})
			expect(result.size).toBe(0)
		})

		it('should find first item matching partial value', () => {
			const result = search(prepared.mapOfObjects, {
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
			const result = search(prepared.mapOfObjects, {
				query: { name: 'ali' },
				ignoreCase: false,
				matchExact: false,
			})
			expect(result.size).toBe(0)
		})

		it('should limit number of results', () => {
			const result = search(prepared.mapOfObjects, {
				query: { name: 'e' },
				limit: 1,
				matchExact: false,
			})
			const expected = new Map([[1, { age: 30, name: 'Alice' }]])
			compareMap(result, expected)
		})

		it('should return empty map when no match found', () => {
			const result = search(prepared.mapOfObjects, {
				query: { name: 'Zoe' },
			})
			expect(result.size).toBe(0)
		})

		it('should accept RegExp as keyword', () => {
			const result = search(prepared.mapOfObjects, {
				query: { name: /^ali/i },
			})
			const expected = new Map([[1, { age: 30, name: 'Alice' }]])
			compareMap(result, expected)
		})
	})

	describe('array', () => {
		it('should return empty array when non-array provided or array with non-object values provided', () => {
			const config = { asMap: false, query: '2' }
			expect(search([1, 2, 4] as any, config)).toEqual([])
			expect(search(null as any, config)).toEqual([])
			expect(search(undefined as any, config)).toEqual([])
		})

		it('should return rearch result as a map by default', () => {
			const arrOfObjects = Array.from(prepared.mapOfObjects.values())
			const result = search(arrOfObjects, {
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

		it('should return rearch result as array', () => {
			const arr = [
				{ age: 80, name: 'alice' },
				{ age: 85, name: 'bob' },
				{ age: 90, name: 'charlie' },
			]
			const first2 = arr.slice(0, 2)
			const config = {
				asMap: false,
				matchAll: false,
				query: { age: 8 } as { age?: string | number; name?: string },
			}
			expect(search(arr, config)).toEqual(first2)

			config.query.age = '8'
			expect(search(arr, config)).toEqual(first2)

			config.query.name = 'ob'
			expect(search(arr, config)).toEqual(first2)

			config.matchAll = true
			expect(search(arr, config)).toEqual([arr[1]])
		})
	})
})
