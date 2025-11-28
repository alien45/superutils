import { describe, expect, it } from 'vitest'
import {
	isAsyncFn,
	isBool,
	isError,
	isFn,
	isPromise,
	isSet,
	isStr,
	isDefined,
	// isSubjectLike,
	isSymbol,
	noop,
} from '../../src'
import is, * as all from '../../src/is'

describe('is', () => {
	it('should contains all isXYZ functions', () => {
		const _all = { ...all }
		const ignoreKeys = ['default', 'is']
		const isKeys = Object.keys(is).sort()
		const allKeys = Object.keys(_all)
			.sort()
			.map(
				x =>
					!ignoreKeys.includes(x)
					&& x.charAt(2).toLocaleLowerCase() + x.slice(3),
			)
			.filter(Boolean) as string[]
		expect(isKeys.length).toBe(allKeys.length)
		expect(isKeys.join()).toBe(allKeys.join())
	})
})

describe('isAsyncFn', () => {
	it('should return true for async functions', () => {
		expect(isAsyncFn(async () => {})).toBe(true)
		expect(isAsyncFn(async function () {})).toBe(true)
	})
	it('should return false for non-async functions', () => {
		expect(isAsyncFn(() => {})).toBe(false)
		expect(isAsyncFn(() => Promise.resolve(0))).toBe(false)
		expect(isAsyncFn(function () {})).toBe(false)
		expect(
			isAsyncFn(function () {
				return Promise.resolve(0)
			}),
		).toBe(false)
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

describe('isDefined', () => {
	it('should return true if when value is not undefined/null', () => {
		expect(isDefined(new Date())).toBe(true)
		expect(isDefined(new Date(undefined as any))).toBe(true) // Invalid Date
		expect(isDefined(new Map())).toBe(true)
		expect(isDefined(NaN)).toBe(true)
		expect(isDefined(0)).toBe(true)
		expect(isDefined('')).toBe(true)
		expect(isDefined(Infinity)).toBe(true)
	})
	it('should return false if when value is undefined/null', () => {
		expect(isDefined(null)).toBe(false)
		expect(isDefined(undefined)).toBe(false)
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
		expect(isFn(123)).toBe(false)
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

// describe('isSubjectLike', () => {
// 	it('should return true for RxJS subject-like objects', () => {
// 		const subjectLike = {
// 			subscribe: noop,
// 			next: noop,
// 		}
// 		expect(isSubjectLike(subjectLike)).toBe(true)
// 		expect(isSubjectLike({ ...subjectLike, value: 42 }, true)).toBe(true)
// 	})
// 	it('should return false for non-subject-like objects when withValue is true', () => {
// 		expect(
// 			isSubjectLike(
// 				{
// 					subscribe: noop,
// 					next: noop,
// 				},
// 				true,
// 			),
// 		).toBe(false)
// 	})

// 	it('should return false for non-subject-like objects', () => {
// 		expect(isSubjectLike({ subscribe: noop })).toBe(false)
// 		expect(isSubjectLike({ next: noop })).toBe(false)
// 		expect(isSubjectLike({})).toBe(false)
// 		expect(isSubjectLike(null)).toBe(false)
// 	})
// })

describe('isSymbol', () => {
	it('should return true for symbols', () => {
		expect(isSymbol(Symbol('test'))).toBe(true)
	})
	it('should return false for non-symbols', () => {
		expect(isSymbol('test')).toBe(false)
		expect(isSymbol(123)).toBe(false)
	})
})
