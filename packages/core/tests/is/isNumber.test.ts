import { describe, expect, it } from 'vitest'
import {
	isInteger,
	isPositiveInteger,
	isPositiveNumber,
	isNumber,
	isNegativeInteger,
	isNegativeNumber,
} from '../../src'

const invalidNumbers = [Infinity, -Infinity, NaN, new Map(), {}, [], '10']

describe('isInteger', () => {
	it('should return true for integers', () => {
		expect(isInteger(10)).toBe(true)
		expect(isInteger(-10)).toBe(true)
	})
	it('should return false for non-integers', () => {
		;[10.5, ...invalidNumbers].every(x => expect(isInteger(x)).toBe(false))
	})
})

describe('isNegativeInteger', () => {
	it('should return true for negative numbers', () => {
		expect(isNegativeInteger(-1)).toBe(true)
		expect(isNegativeInteger(-10)).toBe(true)
	})
	it('should return false for non-negative & invalid numbers', () => {
		;[0, 10.5, ...invalidNumbers].every(x =>
			expect(isNegativeInteger(x)).toBe(false),
		)
	})
})

describe('isNegativeNumber', () => {
	it('should return true for valid numbers', () => {
		;[-0.1, -1e-100, -10.5].every(x =>
			expect(isNegativeNumber(x)).toBe(true),
		)
	})
	it('should return false for invalid numbers', () => {
		;[0, 1e-100, 10.5, ...invalidNumbers].every(x =>
			expect(isNegativeNumber(x)).toBe(false),
		)
	})
})

describe('isNumber', () => {
	it('should return true for valid numbers', () => {
		expect(isNumber(10)).toBe(true)
		expect(isNumber(-10.5)).toBe(true)
	})
	it('should return false for invalid numbers', () => {
		;[...invalidNumbers].every(x => expect(isNegativeNumber(x)).toBe(false))
	})
})

describe('isPositiveInteger', () => {
	it('should return true for positive integers', () => {
		expect(isPositiveInteger(10)).toBe(true)
	})
	it('should return false for non-positive integers', () => {
		;[0, -1, -1e-99, ...invalidNumbers].every(x =>
			expect(isPositiveInteger(x)).toBe(false),
		)
	})
})

describe('isPositiveNumber', () => {
	it('should return true for positive numbers', () => {
		;[10, 10.5, 1e-99].every(x => expect(isPositiveNumber(x)).toBe(true))
	})
	it('should return false for non-positive numbers', () => {
		;[0, -1, -1e-99, ...invalidNumbers].every(x =>
			expect(isPositiveNumber(x)).toBe(false),
		)
	})
})
