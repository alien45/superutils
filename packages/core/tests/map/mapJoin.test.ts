import { describe, expect, it } from 'vitest'
import { mapJoin } from '../../src'
import { compareMap } from './prepareMap'

describe('mapJoin', () => {
	it('should join multiple maps into one', () => {
		const map1 = new Map([
			['a', 1],
			['b', 2],
		])
		const map2 = new Map([
			['c', 3],
			['d', 4],
		])
		const result = mapJoin(map1, map2)
		const expected = new Map([
			['a', 1],
			['b', 2],
			['c', 3],
			['d', 4],
		])
		compareMap(result, expected)
	})

	it('should join a mix of maps and arrays into a single map', () => {
		const entries: [string, number][] = [
			['x', 10],
			['y', 20],
		]
		const map = new Map([
			['a', 1],
			['b', 2],
		])
		const entries2: [string, number][] = [
			['m', 100],
			['n', 200],
		]
		const result = mapJoin(entries, map, entries2)
		const expected = new Map([
			['x', 10],
			['y', 20],
			['a', 1],
			['b', 2],
			['m', 100],
			['n', 200],
		])
		compareMap(result, expected)
	})

	it('should return empty map when no valid maps or arrays provided', () => {
		const result = mapJoin(...([{}, [], null, 'str', 2, false] as any))
		expect(result.size).toBe(0)
	})
})
