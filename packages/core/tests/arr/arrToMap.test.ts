import { describe, expect, it } from 'vitest'
import { arrToMap } from '../../src'

describe('arrToMap', () => {
	it('should return empty map for unsupported values', () => {
		expect(arrToMap(null as any)).instanceOf(Map)
		expect(arrToMap(undefined as any).size).toBe(0)
	})

	it('should convert array to map and flatten array', () => {
		const result = arrToMap([0, 1, [[[2]]]], 3)
		expect(result).instanceOf(Map)
		expect([...result.entries()]).toEqual([
			[0, 0],
			[1, 1],
			[2, 2],
		])
		expect(result.size).toBe(3)
	})

	it('should use callback to generate keys', () => {
		const arr = [1, 2, 3]
		const keys = ['a', 'b', 'c']
		const result = arrToMap(arr, (_, i) => keys[i])
		expect(result).instanceOf(Map)
		expect([...result.entries()]).toEqual([
			['a', 1],
			['b', 2],
			['c', 3],
		])
		expect(result.size).toBe(3)
	})

	it('should use object properties as keys', () => {
		const arr = [{ a: 'x' }, { a: 'y' }, { a: 'z' }]
		const result = arrToMap(arr, 'a')
		expect(result).instanceOf(Map)
		expect([...result.entries()]).toEqual([
			['x', { a: 'x' }],
			['y', { a: 'y' }],
			['z', { a: 'z' }],
		])
		expect(result.size).toBe(3)
	})
})
