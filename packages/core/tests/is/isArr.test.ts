import { describe, expect, it } from 'vitest'
import vm from 'node:vm'
import {
	isArr,
	isArrUnique,
	isArr2D,
	isArrLike,
	isArrLikeSafe,
	isArrObj,
	isUint8Arr,
} from '../../src'

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

describe('isArr2D', () => {
	it('should return false when array is not 2D', () => {
		expect(isArr2D([1, 2, 2, 3, 3, 3])).toEqual(false)
	})
	it('should return true when array is 2D', () => {
		expect(isArr2D([[1], [2], [3, 4]])).toEqual(true)
	})
})

describe('isArrLike', () => {
	it('should return false when value is not Array/Set/Map', () => {
		const results = [{}, 'string', 2, null, true].map(isArrLike)
		expect(results.every(r => !r)).toBe(true)
	})
	it('should return true when value is Array/Set/Map', () => {
		expect(isArrLike([1, 2, 3])).toEqual(true)
		expect(isArrLike(new Map([[1, 'a']]))).toEqual(true)
		expect(isArrLike(new Set([1, 2, 3]))).toEqual(true)
	})
})

describe('isArrLikeSafe', () => {
	const context = vm.createContext({})
	const runInVm = (x: string) => vm.runInContext(x, context)

	it('should return false when value is not Array/Set/Map', () => {
		const results = ['{}', '"string"', '2', 'null', 'true'].map(x =>
			isArrLikeSafe(runInVm(x)),
		)
		expect(results.every(r => !r)).toBe(true)
	})

	it('should return true when value is Array/Set/Map', () => {
		const results = [
			'[1, 2, 3]',
			'new Map([[1, 2]])',
			'new Set([1, 2, 3])',
		].map(x => isArrLikeSafe(runInVm(x)))

		expect(results).toEqual([true, true, true])
	})
})

describe('isArrObj', () => {
	it('should return false for non-array values', () => {
		const results = [{}, 'string', 2, null, true].map(x => isArrObj(x))
		expect(results.every(r => !r)).toBe(true)
	})

	it('should return false for array of non-plain-objects and mix of objects & non-objects', () => {
		expect(isArrObj([1, 2, 3])).toEqual(false)
		expect(isArrObj([new Map()])).toEqual(false)
		expect(isArrObj([new Set()])).toEqual(false)
		expect(isArrObj([{}, new Set()])).toEqual(false)
		class Test {
			a = 1
		}
		expect(isArrObj([new Test()])).toEqual(false)
	})

	it('should return for array of plain-objects', () => {
		expect(isArrObj([{ a: 1 }])).toEqual(true)
		expect(isArrObj([{}, Object.create(null)])).toEqual(true)
	})
})

describe('isArrUnique', () => {
	it('should return false when array contains non-unique values', () => {
		expect(isArrUnique([1, 2, 2, 3, 3, 3])).toEqual(false)
	})
	it('should return true array only contains unique values', () => {
		expect(isArrUnique([1, 2, 3])).toEqual(true)
	})
})

describe('isUint8Arr', () => {
	it('should return true for Uint8Array', () => {
		expect(isUint8Arr(new Uint8Array())).toBe(true)
	})
	it('should return false for non-URL objects', () => {
		expect(isUint8Arr(new Uint16Array())).toBe(false)
	})
})
