import { describe, expect, it } from 'vitest'
import { isDate, isDateValid } from '../../src'

describe('isDate', () => {
	it('should return true for Date objects', () => {
		expect(isDate(new Date())).toBe(true)
	})
	it('should return false for non-Date objects', () => {
		expect(isDate('2022-01-01')).toBe(false)
		expect(isDate(1640995200000)).toBe(false)
	})
})

describe('isDateValid', () => {
	it('should accept valid Date object or strings', () => {
		expect(isDateValid(new Date())).toBe(true)
		expect(isDateValid('2022-01-01')).toBe(true)
		expect(isDateValid('2022-03-20T10:21:54.159Z')).toBe(true)
	})

	it('should reject Date object with `Invalid Date {}`', () => {
		expect(isDateValid(new Date(undefined as any))).toBe(false)
	})

	it('should reject incorrect date string', () => {
		expect(isDateValid('2022-02-31')).toBe(false)
	})

	it('should reject random string', () => {
		expect(isDateValid('testing')).toBe(false)
		expect(isDateValid(null)).toBe(false)
		expect(isDateValid(99)).toBe(false)
	})
})
