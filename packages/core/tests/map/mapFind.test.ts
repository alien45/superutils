import { describe, expect, it } from 'vitest'
import { mapFind } from '../../src'
import { prepareMapOfObjects } from './prepareMap'

describe('mapFind', () => {
	const prepared = prepareMapOfObjects()
	it('should find object-item by key and value', () => {
		const result = mapFind(prepared.mapOfObjects, {
			query: { name: 'Bob' },
			matchExact: true,
			includeKey: true,
		})
		expect(result).toEqual([2, { name: 'Bob', age: 25 }])
	})

	it('should find first item matching partial value', () => {
		const result = mapFind(prepared.mapOfObjects, {
			query: { name: 'Eve' },
			matchExact: true,
		})
		expect(result).toEqual({ age: 22, name: 'Eve' })
	})
})
