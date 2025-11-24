import { describe, expect, it } from 'vitest'
import vm from 'node:vm'
import { isEmpty, isEmptySafe } from '../../src'

describe('isEmpty', () => {
	it('should return true for empty values', () => {
		const results = [
			null,
			undefined,
			NaN,
			Infinity,
			'',
			'      ',
			// multi-line string with only whitespaces & tabs
			`   


			`,
			[],
			new Map(),
			new Set(),
			{},
			Object.create(null),
		].map(x => isEmpty(x, false))
		expect(results.every(Boolean)).toBe(true)
	})

	it('should return false for non-empty values', () => {
		const results = [
			false,
			true,
			1,
			BigInt(0),
			new Date(),
			new Error('error'),
			'  sdf ',
			'   sdf   ',
			// multi-line string with only whitespaces & tabs
			`   
					sfad
					safd
			`,
			[1, 2, 3],
			new Map([[1, 'a']]),
			new Set([1]),
			{ a: 1 },
			(() => {
				const obj = Object.create(null)
				obj.a = 1
				return obj
			})(),
			(() => {
				class CustomError extends Error {}
				return new CustomError('custom error')
			})(),
		].map(x => isEmpty(x, true))
		expect(results.every(Boolean)).toBe(false)
	})

	it('should check values created in other realms', () => {
		const context = vm.createContext({})
		const runInVm = (x: string) => vm.runInContext(x, context)

		const locals = [
			'null',
			'undefined',
			'NaN',
			'Infinity',
			'""',
			'[]',
			'Object.create(null)', //Prototype is null and has no properties
		]
		expect(locals.every(Boolean)).toBe(true)

		/**
		 * inter-realm value type not recognized
		 */
		const otherRealm = [
			'new Map()',
			'new Set()',
			'({})',
			'new Uint16Array()',
			'new Uint32Array()',
			`(() => {
				class CustomClass {}
				return new CustomClass()
			})()`,
		].map(x => isEmpty(runInVm(x)))
		expect(otherRealm.every(x => !x)).toBe(true)
	})
})

describe('isEmptySafe', () => {
	const context = vm.createContext({})
	const runInVm = (x: string) => vm.runInContext(x, context)

	it('should return true for empty values from local-realm', () => {
		const results = [
			null,
			undefined,
			NaN,
			Infinity,
			'',
			'      ',
			// multi-line string with only whitespaces & tabs
			`   


			`,
			[],
			new Map(),
			new Set(),
			{},
			Object.create(null),
		].map(x => isEmptySafe(x, false))
		expect(results.every(Boolean)).toBe(true)
	})

	it('should return true for empty values from other realm', () => {
		const results = [
			'null',
			'undefined',
			'NaN',
			'Infinity',
			'""',
			'"      "',
			// multi-line string with only whitespaces & tabs
			`\`   


			\``,
			'[]',
			'new Uint8Array()',
			'new Map()',
			'new Set()',
			'{}',
			'Object.create(null)',
			// custom class instance: recognized as object but has no properties
			`(() => {
				class CustomClass {}
				return new CustomClass()
			})()`,
		].map(x => isEmptySafe(runInVm(x), false))
		expect(results.every(Boolean)).toBe(true)
	})

	it('should return false for non-empty values from other realm', () => {
		const results = [
			'0',
			'"string"',
			'new Date()',
			'[1, 2, 3]',
			'new Array(1,2,3)',
			'new Uint8Array(1,2,3)',
			'new Date()',
			'new Map([[1, "a"]])',
			'new Set([1, 2, 3])',
			'{ a: 1 }',
			// custom class instance: recognized as object with properties
			`(() => {
				class CustomClass {
					a = 1
				}
				return new CustomClass()
			})()`,
			'new Uint16Array(1,2,3)', // unrecognized, therefore, presumed not empty
		].map(x => isEmptySafe(runInVm(x), false))
		expect(results.every(r => !r)).toBe(true)
	})
})
