import { describe, expect, it, vi } from 'vitest'
import { getUrlParam } from '../../src'

describe('getUrlParam', () => {
	const runTests = (forceUseRegex = false) => {
		const href =
			'https://example.com?page=2&sort=asc&filter=one&filter=two&filter=three&filter=four'
		const params = {
			page: '2',
			sort: 'asc',
			filter: ['one', 'two', 'three', 'four'],
		}
		const mockWindow = vi.mockObject({
			location: { href },
		})

		it('should return URL parameters as an object', () => {
			if (forceUseRegex) vi.stubGlobal('URLSearchParams', undefined)
			expect(getUrlParam()).toEqual({})
			expect(getUrlParam('', href)).toEqual(params)
			expect(getUrlParam(null as any, new URL(href))).toEqual(params)
			vi.unstubAllGlobals()
		})

		it('should return empty string/object when running on non-browser enviroments', () => {
			if (forceUseRegex) vi.stubGlobal('URLSearchParams', undefined)
			expect(getUrlParam('', href.split('?')[0])).toEqual({}) // URL with no parameters
			expect(getUrlParam('page')).toEqual('')
			expect(getUrlParam('filter', undefined, ['filter'])).toEqual([''])
			vi.unstubAllGlobals()
		})

		it('should return all URL parameters from browser location', () => {
			vi.stubGlobal('window', mockWindow)
			const result = getUrlParam()
			expect(result).toEqual(params)
			vi.unstubAllGlobals()
		})

		it('should return specified parameter by name', () => {
			if (forceUseRegex) vi.stubGlobal('URLSearchParams', undefined)
			vi.stubGlobal('window', mockWindow)
			expect(getUrlParam('page')).toEqual(params.page)
			expect(getUrlParam('sort')).toEqual(params.sort)
			expect(getUrlParam('filter')).toEqual(params.filter)
			vi.unstubAllGlobals()
		})

		it('should force a parameter value to be array', () => {
			if (forceUseRegex) vi.stubGlobal('URLSearchParams', undefined)
			vi.stubGlobal('window', mockWindow)
			expect(getUrlParam('page', undefined, true)).toEqual(['2'])
			vi.unstubAllGlobals()
		})

		it('should handle array values even when name is not specified in asArray argument', () => {
			if (forceUseRegex) vi.stubGlobal('URLSearchParams', undefined)
			vi.stubGlobal('window', mockWindow)
			const result = getUrlParam('filter', undefined, ['page'])
			expect(result).toEqual(params.filter)
			vi.unstubAllGlobals()
		})
	}

	runTests(false)

	describe('fallback to getUrlParamRegex() when URLSearchParams is not supported', () => {
		// run the same tests but force use of getUrlParamRegex
		runTests(true)
	})
})
