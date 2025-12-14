import { describe, expect, it } from 'vitest'
import { find } from '../../src'
import { prepareMapOfObjects } from './prepareMap'

describe('find', () => {
	const prepared = prepareMapOfObjects()
	it('should find object-item by key and value', () => {
		const result = find(prepared.mapOfObjects, {
			includeKey: true,
			matchExact: true,
			query: { name: 'Bob' },
		})
		expect(result).toEqual(['bob', { name: 'Bob', age: 25 }])
	})

	it('should find first item matching partial value', () => {
		const result = find(prepared.mapOfObjects, {
			matchExact: true,
			query: { name: 'Eve' },
		})
		expect(result).toEqual({ age: 22, name: 'Eve' })
	})

	it('should find by using callback', () => {
		const result = find(prepared.mapOfObjects, ({ name }) => name === 'Eve')
		expect(result).toEqual({ age: 22, name: 'Eve' })
	})
})
