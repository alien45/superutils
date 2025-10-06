import { describe, expect, it } from 'vitest'
import { objSort } from '../src'

describe('objSort', () => {
	it('should sort an object by keys', () => {
		const obj = { c: 3, a: 1, b: 2 }
		const sortedObj = objSort(obj)
		expect(sortedObj).toEqual({ a: 1, b: 2, c: 3 })
	})

	it('should do nothing if non-object is provided', () => {
		const obj = null as any
		const returned = objSort(obj)
		expect(returned).toEqual(null)
	})
})
