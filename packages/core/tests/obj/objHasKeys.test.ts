import { describe, expect, it } from 'vitest'
import { objHasKeys } from '../../src'

describe('objClean', () => {
	it('should return false when invalid values provided', () => {
		expect(objHasKeys(null as any, null as any)).toEqual(false)
	})

	it('should check if object contains given properties/keys', () => {
		expect(objHasKeys({ a: 1, b: 2 }, ['a', 'b'])).toEqual(true)
		expect(objHasKeys({ a: 1, b: 2 }, ['c', 'b'])).toEqual(false)
	})

	it('should check if object contains given properties/keys and value is not empty', () => {
		expect(objHasKeys({ a: 1, b: 2 }, ['a', 'b'], true)).toEqual(true)
		expect(objHasKeys({ a: 1, b: undefined }, ['a', 'b'], true)).toEqual(
			false,
		)
	})
})
