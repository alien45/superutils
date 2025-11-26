import { describe, expect, it } from 'vitest'
import {
	isInteger,
	isPositiveInteger,
	isPositiveNumber,
	isNumber,
} from '../../src'

describe('isInteger', () => {
	it('should return true for integers', () => {
		expect(isInteger(10)).toBe(true)
		expect(isInteger(-10)).toBe(true)
	})
	it('should return false for non-integers', () => {
		expect(isInteger(10.5)).toBe(false)
		expect(isInteger('10')).toBe(false)
	})
})

describe('isPositiveInteger', () => {
	it('should return true for positive integers', () => {
		expect(isPositiveInteger(10)).toBe(true)
	})
	it('should return false for non-positive integers', () => {
		expect(isPositiveInteger(-10)).toBe(false)
		expect(isPositiveInteger(0)).toBe(false)
		expect(isPositiveInteger(10.5)).toBe(false)
	})
})

describe('isPositiveNumber', () => {
	it('should return true for positive numbers', () => {
		expect(isPositiveNumber(10)).toBe(true)
		expect(isPositiveNumber(10.5)).toBe(true)
	})
	it('should return false for non-positive numbers', () => {
		expect(isPositiveNumber(-10)).toBe(false)
		expect(isPositiveNumber(0)).toBe(false)
	})
})

describe('isNumber', () => {
	it('should return true for valid numbers', () => {
		expect(isNumber(10)).toBe(true)
		expect(isNumber(-10.5)).toBe(true)
	})
	it('should return false for invalid numbers', () => {
		expect(isNumber(Infinity)).toBe(false)
		expect(isNumber(-Infinity)).toBe(false)
		expect(isNumber(NaN)).toBe(false)
	})
})
