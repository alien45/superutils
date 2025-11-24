import { describe, expect, it } from 'vitest'
import { arrReadOnly, arrReverse, arrSearch, arrUnique } from '../../src'

describe('arr', () => {
	describe('arrReadOnly', () => {
		it('should return a new read-only array and silently ignore mutation attempts', () => {
			const roArr = arrReadOnly([1, 2, 3, 4, 5], {
				add: false,
				silent: true,
			})
			expect(() => roArr.push(6)).not.toThrow()
			expect(() => roArr.reverse()).not.toThrow()
			expect(() => roArr.shift()).not.toThrow()
			expect(() => roArr.unshift(7)).not.toThrow()
			expect([...roArr]).toEqual([1, 2, 3, 4, 5])
		})

		it('should return a new read-only array and throw errors on mutation attempts', () => {
			const roArr = arrReadOnly([1, 2, 3, 4, 5], {
				add: false,
				silent: false,
			})
			expect(() => roArr.push(6)).toThrow()
			expect(() => roArr.reverse()).toThrow()
			expect(() => roArr.shift()).toThrow()
			expect(() => roArr.unshift(7)).toThrow()
			expect([...roArr]).toEqual([1, 2, 3, 4, 5])
		})

		it('should return a new read-only array and only allow adding to array', () => {
			const roArr = arrReadOnly([1, 2, 3, 4, 5], {
				add: true,
				silent: false,
			})

			expect(() => roArr.push(6)).not.toThrow()
			expect(() => roArr.reverse()).toThrow()
			expect(() => roArr.shift()).toThrow()
			expect(() => roArr.unshift(7)).toThrow()
			expect([...roArr]).toEqual([1, 2, 3, 4, 5, 6])
		})
	})

	describe('arrReverse', () => {
		it('should return a new array with reversed elements', () => {
			expect(arrReverse([1, 2, 4])).toEqual([4, 2, 1])
		})
	})

	describe('arrSearch', () => {
		it('should return empty array when non-array or array of non-objects provided', () => {
			expect(arrSearch([1, 2, 4] as any, { query: '2' })).toEqual([])
			expect(arrSearch(new Map() as any, { query: '2' })).toEqual([])
			expect(arrSearch(null as any, { query: '2' })).toEqual([])
			expect(arrSearch(undefined as any, { query: '2' })).toEqual([])
		})
		it('should return empty array when non-array or array of non-objects provided', () => {
			const arr = [
				{ age: 80, name: 'alice' },
				{ age: 85, name: 'bob' },
				{ age: 90, name: 'charlie' },
			]
			const first2 = arr.slice(0, 2)
			const config = {
				matchAll: false,
				query: { age: 8 } as { age?: string | number; name?: string },
			}
			expect(arrSearch(arr, config)).toEqual(first2)

			config.query.age = '8'
			expect(arrSearch(arr, config)).toEqual(first2)

			config.query.name = 'ob'
			expect(arrSearch(arr, config)).toEqual(first2)

			config.matchAll = true
			expect(arrSearch(arr, config)).toEqual([arr[1]])
		})
	})

	describe('arrUnique', () => {
		it('should return a new array with unique elements', () => {
			expect(arrUnique([1, 2, 4, 3, 4, 5])).toEqual([1, 2, 4, 3, 5])
		})
	})
})
