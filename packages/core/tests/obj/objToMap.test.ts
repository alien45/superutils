import { describe, expect, it } from 'vitest'
import { objToMap, objToMapOfObj } from '../../src'

interface User {
	age: number
	isAdmin: boolean
	name: string
}
const user: User = {
	age: 1,
	isAdmin: false,
	name: 'c',
}

describe('objToMap', () => {
	it('should return empty map if input is not an object', () => {
		const r = objToMap(null as any)
		expect(r).toBeInstanceOf(Map)
		expect(r.size).toBe(0)
		r.set('key', 'value')
		expect(r.size).toBe(1)
	})

	it('should convert an object to a map', () => {
		const obj: User = {
			age: 1,
			isAdmin: false,
			name: 'c',
		}

		const map = objToMap(obj)
		const x = map.get('age')
		expect(x).toBe(1)
	})

	it('should convert an object to a map of objects', () => {
		const map = objToMapOfObj(user, 'key')
		const x = map.get('age')
		expect(x).toEqual({ key: 1 })
	})
})

describe('objToMapOfObj', () => {
	it('should return empty map if input is not an object', () => {
		const r = objToMapOfObj(null as any)
		expect(r).toBeInstanceOf(Map)
		expect(r.size).toBe(0)
		r.set('key', { value: 'value' })
		expect(r.size).toBe(1)
		expect(r.get('key')).toEqual({ value: 'value' })
	})

	it('should convert an object to a map', () => {
		const obj: User = {
			age: 1,
			isAdmin: false,
			name: 'c',
		}

		const map = objToMapOfObj(obj)
		const x = map.get('age')
		expect(x).toEqual({ value: 1 })
	})

	it('should convert an object to a map of objects', () => {
		const map = objToMapOfObj(user)
		const x = map.get('age')
		expect(x).toEqual({ value: 1 })
	})

	it('should convert an object to a map of objects with specified property name', () => {
		const map = objToMapOfObj(user, 'property')
		const x = map.get('age')
		expect(x).toEqual({ property: 1 })
	})
})
