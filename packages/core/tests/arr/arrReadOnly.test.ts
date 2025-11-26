import { describe, expect, it } from 'vitest'
import { arrReadOnly } from '../../src'

describe('arrReadOnly', () => {
	it('should return a new read-only array and silently ignore mutation attempts', () => {
		const roArr = arrReadOnly([1, 2, 3, 4, 5], {
			add: false,
			silent: true,
		})
		expect(() => roArr.push(6)).not.toThrow()
		expect(() => roArr.splice(1)).not.toThrow()
		expect(() => roArr.reverse()).not.toThrow()
		expect(() => roArr.reverse()).not.toThrow()
		expect(() => roArr.shift()).not.toThrow()
		expect(() => roArr.unshift(7)).not.toThrow()
		expect([...roArr]).toEqual([1, 2, 3, 4, 5])
	})

	it('should return a new read-only array and throw errors on mutation attempts', () => {
		const roArr = arrReadOnly([1, 2, 3, 4, 5], {
			add: false,
			silent: false,
		})
		expect(() => roArr.push(6)).toThrow()
		expect(() => roArr.splice(1)).toThrow()
		expect(() => roArr.reverse()).toThrow()
		expect(() => roArr.reverse()).toThrow()
		expect(() => roArr.shift()).toThrow()
		expect(() => roArr.unshift(7)).toThrow()
		expect([...roArr]).toEqual([1, 2, 3, 4, 5])
	})

	it('should return a new read-only array and only allow adding to array', () => {
		const roArr = arrReadOnly([1, 2, 3, 4, 5], {
			add: true,
			silent: false,
		})

		expect(() => roArr.push(6)).not.toThrow()
		expect(() => roArr.pop()).toThrow()
		expect(() => roArr.splice(1)).toThrow()
		expect(() => roArr.reverse()).toThrow()
		expect(() => roArr.shift()).toThrow()
		expect(() => roArr.unshift(7)).toThrow()
		expect([...roArr]).toEqual([1, 2, 3, 4, 5, 6])
	})
})
