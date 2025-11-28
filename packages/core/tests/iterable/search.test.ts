import { describe, it, expect } from 'vitest'
import { search } from '../../src'
import { compareMap, MapEntry, prepareMapOfObjects } from './prepareMap'

describe('search', () => {
	const prepared = prepareMapOfObjects()

	it('should return undefined when map or conf is unexpected value', () => {
		compareMap(search(null as any, null as any), new Map())
	})

	describe('array', () => {
		it('should return empty array when non-array values provided', () => {
			const config = { asMap: false, query: '2' }
			expect(search(null as any, config)).toEqual([])
			expect(search(undefined as any, config)).toEqual([])
			config.query = 'null'
			expect(search([undefined, null], config)).toEqual([])
			config.query = 'undefined'
			expect(search([undefined, null], config)).toEqual([])
		})

		it('should search array with non-object values', () => {
			const config = { asMap: false, query: '2' }
			expect(search([1, 2, 4], config)).toEqual([2])
			config.query = 'false'
			expect(search([true, false], config)).toEqual([false])
		})

		it('should use `propToStr()` when searching array of objects containing object properties', () => {
			const arr = [...prepared.mapOfObjects.values()]
				// convert name property into an object with firstName and lastName
				.map(({ age, name }) => ({
					age,
					nameArr: [name.split('').reverse().join(''), name],
					name: {
						first: name.split('').reverse().join(''),
						last: name,
					},
				}))
			const result = search(arr, {
				asMap: false, // returns array
				// merge name object into a single string
				transform: ({ name, nameArr }, v, key) =>
					key !== 'name'
						? key === 'nameArr'
							? nameArr.join(' ')
							: ''
						: `${name.first} ${name.last}`,
				// search by name
				query: { name: 've' },
				matchAll: true,
			})
			const expected = [
				{
					age: 28,
					name: { first: 'evaD', last: 'Dave' },
					nameArr: ['evaD', 'Dave'],
				},
				{
					age: 22,
					name: { first: 'evE', last: 'Eve' },
					nameArr: ['evE', 'Eve'],
				},
			]
			expect(result).toEqual(expected)

			expect(
				search(arr, { asMap: false, query: { nameArr: 've' } }),
			).toEqual(expected)
		})

		it('should return search result as a map by default', () => {
			const arrOfObjects = [...prepared.mapOfObjects.values()]
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

	describe('map', () => {
		it('should return empty map when invalid', () => {
			const result = search(prepared.mapOfObjects, {
				query: { name: 'ali' },
				ignoreCase: false,
				matchExact: false,
			})
			expect(result.size).toBe(0)
		})

		it('should return items matching partial value', () => {
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

		it('should do fuzzy-search on all properties and combine results', () => {
			const result = search(prepared.mapOfObjects, {
				matchExact: false,
				query: 've',
				// provide an item that should be returned along with the results.
				// even when result is empty this item will not be touched.
				result: new Map([[9999, { age: 99, name: 'Adam' }]]),
			})
			const expected = new Map([
				[9999, { age: 99, name: 'Adam' }],
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
})
