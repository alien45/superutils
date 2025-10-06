import { describe, expect, it } from 'vitest'
import {
	isArr,
	isArrUnique,
	isAsyncFn,
	isBool,
	isDate,
	isError,
	isFn,
	isInteger,
	isMap,
	isObj,
	isPositiveInteger,
	isPositiveNumber,
	isPromise,
	isSet,
	isStr,
	isUrl,
	isValidNumber,
	isValidDate,
	isValidURL,
} from '../src'

describe('is', () => {
	describe('isArr', () => {
		it('should return true for arrays', () => {
			expect(isArr([])).toBe(true)
			expect(isArr([1, 2, 3])).toBe(true)
		})
		it('should return false for non-arrays', () => {
			expect(isArr({})).toBe(false)
			expect(isArr(123)).toBe(false)
			expect(isArr('string')).toBe(false)
			expect(isArr(null)).toBe(false)
			expect(isArr(undefined)).toBe(false)
		})
	})

	describe('isArrUnique', () => {
		it('should return an array with unique values', () => {
			expect(isArrUnique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
		})
		it('should return the same array if all values are unique', () => {
			expect(isArrUnique([1, 2, 3])).toEqual([1, 2, 3])
		})
	})

	describe('isAsyncFn', () => {
		it('should return true for async functions', () => {
			expect(isAsyncFn(async () => {})).toBe(true)
		})
		it('should return false for non-async functions', () => {
			expect(isAsyncFn(() => {})).toBe(false)
			expect(isAsyncFn(function () {})).toBe(false)
			expect(isAsyncFn({})).toBe(false)
		})
	})

	describe('isBool', () => {
		it('should return true for booleans', () => {
			expect(isBool(true)).toBe(true)
			expect(isBool(false)).toBe(true)
		})
		it('should return false for non-booleans', () => {
			expect(isBool(0)).toBe(false)
			expect(isBool('true')).toBe(false)
			expect(isBool({})).toBe(false)
		})
	})

	describe('isDate', () => {
		it('should return true for Date objects', () => {
			expect(isDate(new Date())).toBe(true)
		})
		it('should return false for non-Date objects', () => {
			expect(isDate('2022-01-01')).toBe(false)
			expect(isDate(1640995200000)).toBe(false)
		})
	})

	describe('isError', () => {
		it('should return true for Error objects', () => {
			expect(isError(new Error())).toBe(true)
		})
		it('should return false for non-Error objects', () => {
			expect(isError({ message: 'error' })).toBe(false)
		})
	})

	describe('isFn', () => {
		it('should return true for functions', () => {
			expect(isFn(() => {})).toBe(true)
			expect(isFn(function () {})).toBe(true)
		})
		it('should return false for non-functions', () => {
			expect(isFn({})).toBe(false)
		})
	})

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

	describe('isMap', () => {
		it('should return true for Map objects', () => {
			expect(isMap(new Map())).toBe(true)
		})
		it('should return false for non-Map objects', () => {
			expect(isMap(new WeakMap())).toBe(false)
			expect(isMap({})).toBe(false)
		})
	})

	describe('isObj', () => {
		it('should return true for objects', () => {
			expect(isObj({})).toBe(true)
			expect(isObj({ a: 1 })).toBe(true)
		})
		it('should return false for non-objects', () => {
			expect(isObj([])).toBe(false)
			expect(isObj(new Map())).toBe(false)
			expect(isObj(new Set())).toBe(false)
			expect(isObj(null)).toBe(false)
			expect(isObj(123)).toBe(false)
		})
		it('should return true for arrays and maps when strict is false', () => {
			expect(isObj([], false)).toBe(true)
			expect(isObj(new Map(), false)).toBe(true)
			expect(isObj(new Set(), false)).toBe(true)
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

	describe('isPromise', () => {
		it('should return true for Promises', () => {
			expect(isPromise(new Promise(() => {}))).toBe(true)
		})
		it('should return false for non-Promises', () => {
			expect(isPromise({ then: () => {} })).toBe(false)
		})
	})

	describe('isSet', () => {
		it('should return true for Set objects', () => {
			expect(isSet(new Set())).toBe(true)
		})
		it('should return false for non-Set objects', () => {
			expect(isSet(new WeakSet())).toBe(false)
			expect(isSet({})).toBe(false)
		})
	})

	describe('isStr', () => {
		it('should return true for strings', () => {
			expect(isStr('hello')).toBe(true)
		})
		it('should return false for non-strings', () => {
			expect(isStr(123)).toBe(false)
		})
	})

	describe('isUrl', () => {
		it('should return true for URL objects', () => {
			expect(isUrl(new URL('http://google.com'))).toBe(true)
		})
		it('should return false for non-URL objects', () => {
			expect(isUrl('http://google.com')).toBe(false)
		})
	})

	describe('isValidDate', () => {
		it('should accept valid Date object or strings', () => {
			expect(isValidDate(new Date())).toBe(true)
			expect(isValidDate('2022-01-01')).toBe(true)
			expect(isValidDate('2022-03-20T10:21:54.159Z')).toBe(true)
		})

		it('should reject Date object with `Invalid Date {}`', () => {
			expect(isValidDate(new Date(undefined as any))).toBe(false)
		})

		it('should reject incorrect date string', () => {
			expect(isValidDate('2022-02-31')).toBe(false)
		})

		it('should reject random string', () => {
			expect(isValidDate('testing')).toBe(false)
			expect(isValidDate(null)).toBe(false)
			expect(isValidDate(99)).toBe(false)
		})
	})

	describe('isValidNumber', () => {
		it('should return true for valid numbers', () => {
			expect(isValidNumber(10)).toBe(true)
			expect(isValidNumber(-10.5)).toBe(true)
		})
		it('should return false for invalid numbers', () => {
			expect(isValidNumber(Infinity)).toBe(false)
			expect(isValidNumber(-Infinity)).toBe(false)
			expect(isValidNumber(NaN)).toBe(false)
		})
	})

	describe('isValidURL', () => {
		it('should return false for universally invalid URL values regardless of strict mode', () => {
			const invalidUrls = [
				undefined,
				null,
				'',
				'some string',
				'http://',
				'www.google.com',
				'http://www.google com',
				'http://www google.com',
			]
			invalidUrls.forEach(url => {
				expect(isValidURL(url, true)).toBe(false)
				expect(isValidURL(url, false)).toBe(false)
			})
		})

		it('should return true for universally valid URL values regardless of strict mode', () => {
			const validUrls = [
				'http://www.google.com',
				'https://www.google.com',
				'https://google.com',
				'https://google.com/some/path',
				new URL('https://google.com/some/path'),
			]
			validUrls.forEach(url => {
				expect(isValidURL(url, true)).toBe(true)
				expect(isValidURL(url, false)).toBe(true)
			})
		})

		it('should return false for loosely or situationally valid URL when in strict mode', () => {
			const invalidStrictUrls = ['http://www.google.com ', 'http://www']
			invalidStrictUrls.forEach(url => {
				expect(isValidURL(url, true)).toBe(false)
			})
		})

		it('should return true for loosely or situationally valid URL when not in strict mode', () => {
			const invalidStrictUrls = ['http://www.google.com ', 'http://www']
			invalidStrictUrls.forEach(url => {
				expect(isValidURL(url, false)).toBe(true)
			})
		})
	})
})
