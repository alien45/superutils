import { describe, expect, it } from 'vitest'
import { objCreate } from '../../src'

describe('objCreate', () => {
	it('should return empty object when invalid keys and values provided', () => {
		expect(objCreate(null as any, null as any)).toEqual({})
	})

	it('should create a new object', () => {
		expect(objCreate(['a', 'b'], [1, 2])).toEqual({ a: 1, b: 2 })
	})
})
