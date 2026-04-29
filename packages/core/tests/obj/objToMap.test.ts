import { describe, expect, it } from 'vitest'
import { objToMap } from '../../src'

describe('objToMap', () => {
	interface Obj {
		a: number
		b: boolean
		c: string
	}

	it('should return empty map if input is not an object', () => {
		const r = objToMap(null as any)
		expect(r).toBeInstanceOf(Map)
		expect(r.size).toBe(0)
		r.set('key', 'value')
		expect(r.size).toBe(1)
	})

	it('should convert an object to a map', () => {
		const obj: Obj = {
			a: 1,
			b: false,
			c: 'c',
		}

		const map = objToMap(obj, false)
		const x = map.get('a')
		expect(x).toBe(1)
	})

	it('should convert an object to a map of objects', () => {
		const obj: Obj = {
			a: 1,
			b: false,
			c: 'c',
		}

		const map = objToMap(obj, true)
		const x = map.get('a')
		expect(x).toEqual({ value: 1 })
	})
})
