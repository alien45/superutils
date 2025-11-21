import { afterEach, beforeEach, expect } from 'vitest'
import { mapEntries } from '../../src'

export type MapEntry = { age: number; name: string }
export const compareMap = (map: Map<any, any>, expected: Map<any, any>) =>
	expect(mapEntries(map)).toEqual(mapEntries(expected))
export const prepareMapOfObjects = () => {
	const prepared = {
		mapOfObjects: new Map<number, MapEntry>(),
	}
	afterEach(() => {
		prepared.mapOfObjects.clear()
	})

	beforeEach(() => {
		prepared.mapOfObjects = new Map([
			[1, { age: 30, name: 'Alice' }],
			[2, { age: 25, name: 'Bob' }],
			[3, { age: 35, name: 'Charlie' }],
			[4, { age: 28, name: 'Dave' }],
			[5, { age: 22, name: 'Eve' }],
		])
	})
	return prepared
}
