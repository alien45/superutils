import { describe, expect, it, vi } from 'vitest'
import { objReadOnly } from '../../src'

describe('objClean', () => {
	it('should return empty object when non-object value provided', () => {
		expect(objReadOnly(null as any)).toEqual({})
	})

	it('should create a new read-only object', () => {
		const obj = objReadOnly(
			{
				a: 1,
				b: 2,
				c: 3,
			},
			{ silent: true }, // defaults
		)

		const addProp = vi.fn(() => {
			;(obj as any).d = 4
		})
		expect(addProp).not.toThrow()
		expect(addProp).toHaveBeenCalledOnce()
		expect((obj as any).d).toBe(undefined)
		expect(obj.hasOwnProperty('d')).toBe(false)

		const defineProp = vi.fn(() => {
			Object.defineProperty(obj, 'e', {
				value: 6,
			})
		})
		expect(defineProp).not.toThrow()
		expect(defineProp).toHaveBeenCalledOnce()
		expect((obj as any).e).toBe(undefined)

		const deleteProp = vi.fn(() => {
			delete (obj as any).a
		})
		expect(deleteProp).not.toThrow()
		expect(deleteProp).toHaveBeenCalledOnce()

		const updateProp = vi.fn(() => {
			obj.a = 11
		})
		expect(updateProp).not.toThrow()
		expect(updateProp).toHaveBeenCalledOnce()
		expect(obj.a).toBe(1)
	})

	it('should create a new read-only object in strict mode (throws error on fail)', () => {
		const obj = objReadOnly(
			{
				a: 1,
				b: 2,
				c: 3,
			},
			{ silent: false },
		)
		const addProp = vi.fn(() => {
			;(obj as any).d = 4
		})
		expect(addProp).toThrow()
		expect(addProp).toHaveBeenCalledOnce()
		expect((obj as any).d).toBe(undefined)
		expect(obj.hasOwnProperty('d')).toBe(false)

		const deleteProp = vi.fn(() => {
			delete (obj as any).a
		})
		expect(deleteProp).toThrow()

		const updateProp = vi.fn(() => {
			obj.a = 11
		})
		expect(updateProp).toThrow()
		expect(updateProp).toHaveBeenCalledOnce()
		expect(obj.a).toBe(1)
	})

	it('should create a new read-only object and allow adding new properties', () => {
		const obj = objReadOnly(
			{
				a: 1,
				b: 2,
				c: 3,
			},
			{ add: true, silent: false },
		)
		const addProp = vi.fn(() => {
			;(obj as any).d = 4
		})
		expect(addProp).not.toThrow()
		expect(addProp).toHaveBeenCalledOnce()
		expect((obj as any).d).toBe(4)
		expect(obj.hasOwnProperty('d')).toBe(true)

		const defineProp = vi.fn(() => {
			Object.defineProperty(obj, 'e', {
				value: 6,
			})
		})
		expect(defineProp).not.toThrow()
		expect(defineProp).toHaveBeenCalledOnce()
		expect((obj as any).e).toBe(6)
		expect(obj.hasOwnProperty('e')).toBe(true)
	})

	it('should create a new read-only object and conditionally allow adding new properties', () => {
		const allowAddFn = vi.fn((obj: object) => Object.keys(obj).length < 4)
		const obj = objReadOnly(
			{
				a: 1,
				b: 2,
				c: 3,
			},
			{ add: allowAddFn, silent: false },
		)
		const addProp = vi.fn(() => {
			;(obj as any).d = 4
		})
		expect(addProp).not.toThrow()
		expect(addProp).toHaveBeenCalledOnce()
		expect((obj as any).d).toBe(4)
		expect(obj.hasOwnProperty('d')).toBe(true)

		const defineProp = vi.fn(() => {
			Object.defineProperty(obj, 'e', {
				value: 6,
			})
		})
		expect(defineProp).toThrow()
		expect(defineProp).toHaveBeenCalledOnce()
		expect((obj as any).e).toBe(undefined)
		expect(obj.hasOwnProperty('e')).toBe(false)

		expect(allowAddFn).toHaveBeenCalledTimes(2)
	})

	it('should create a revocable read-only object', () => {
		const { proxy: obj, revoke } = objReadOnly(
			{
				a: 1,
				b: 2,
				c: 3,
			},
			{ add: false, revocable: true, silent: false },
		)

		const addProp = vi.fn(() => {
			;(obj as any).d = 4
		})
		expect(addProp).toThrow()
		expect(addProp).toHaveBeenCalledOnce()
		expect((obj as any).d).toBe(undefined)
		expect(obj.hasOwnProperty('d')).toBe(false)

		revoke()
		// all access is now turned off and proxy is ready to garbage collected
		expect(addProp).toThrow()
		expect(() => obj.a).toThrow()
		expect(addProp).toHaveBeenCalledTimes(2)
	})
})
