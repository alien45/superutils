import { describe, expect, it } from 'vitest'
import { objCopy } from '../../src'

describe('objCopy', () => {
	it('should should deep-copy object', () => {
		const d = Symbol('d')
		const obj = { c: 3, a: 1, [d]: 4, b: 2 }
		expect(objCopy(obj)).toEqual({ ...obj })
	})

	it('should should deep-copy source & merge into output object', () => {
		const d = Symbol('d')
		const obj = { c: 3, a: 1, [d]: 4, b: 2 }
		expect(objCopy(obj, { a: 2, e: 5 }, [], false)).toEqual({
			...obj,
			a: 2,
			e: 5,
		})
	})

	it('should should override property only when "empty"', () => {
		const d = Symbol('d')
		const obj = { c: 3, a: 1, [d]: 4, b: 2 }
		const copied = objCopy(obj, { a: 2, e: 5 }, [], 'empty')
		expect(copied).toEqual({
			...obj,
			a: 2,
			e: 5,
		})

		const source = {
			a: 1,
			b: 2,
			c: 3,
		}
		const dest = {
			c: 33,
			d: 4,
			e: 5,
		}
		const copied2 = objCopy(source, dest, ['a'], 'empty')
		expect(copied2).toEqual({
			b: 2,
			c: 33,
			d: 4,
			e: 5,
		})
	})

	it('should should exclude specified properties and recursive deep-copy', () => {
		const d = Symbol('d')
		const h = Symbol('h')
		const obj = {
			c: 3,
			a: 1,
			[d]: 4,
			b: 2,
			e: {
				a: 1,
				b: 2,
				c: {
					a: 1,
					b: 2,
				},
			},
			f: { g: 1 },
			[h]: { a: 1 },
			arr: [1, 2, 3],
			ab: new ArrayBuffer(8, { maxByteLength: 16 }),
			date: new Date(),
			func: function () {},
			map: new Map(),
			reg: new RegExp(/D/i),
			set: new Set(),
			uint: new Uint8Array(),
			url: new URL('https://url.com'),
		}
		const copied = objCopy(obj, {}, ['c', d, 'e.a', 'e.c.a'], false, true)
		const expected = {
			a: 1,
			b: 2,
			e: { b: 2, c: { b: 2 } },
			f: { g: 1 },
			[h]: { a: 1 },
			arr: [1, 2, 3],
			ab: expect.any(ArrayBuffer),
			date: expect.any(Date),
			func: expect.any(Function),
			map: expect.any(Map),
			reg: expect.any(RegExp),
			set: expect.any(Set),
			uint: expect.any(Uint8Array),
			url: expect.any(URL),
		}

		expect(copied).toEqual(expected)
	})

	it('should copy object properties and use callback to determine whether property should be overriden', () => {
		const input = { a: 1, b: 2 }
		const output = { a: 2, b: 1 }
		const result = objCopy(
			input,
			output,
			[],
			// override only if output property value is smaller than input property
			(_key, outValue, inValue) => outValue < inValue,
		)
		expect(result).toBe(output)
		expect(result).toEqual({ a: 2, b: 2 })
	})

	it('should return empty object if non-object value is provided', () => {
		const obj = null as any
		expect(objCopy(obj)).toEqual({})
	})
})
