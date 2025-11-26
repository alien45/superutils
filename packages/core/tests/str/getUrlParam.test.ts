import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getUrlParam } from '../../src'

const runTests = (useRegex = false) => {
	const title = useRegex ? 'getUrlParamRegex' : 'getUrlParam'
	describe(title, () => {
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

		afterEach(() => {
			vi.unstubAllGlobals()
		})
		beforeEach(() => {
			vi.stubGlobal('window', mockWindow)
			if (useRegex) vi.stubGlobal('URLSearchParams', undefined)
		})

		it('should return URL parameters as an object', () => {
			vi.stubGlobal('window', undefined) // reverse window mock
			if (useRegex) vi.stubGlobal('URLSearchParams', undefined)
			expect(getUrlParam()).toEqual({})
			expect(getUrlParam('', href)).toEqual(params)
			expect(getUrlParam(null as any, new URL(href))).toEqual(params)
		})

		it('should return empty string/object when running on non-browser enviroments', () => {
			vi.stubGlobal('window', undefined)
			expect(getUrlParam('', href.split('?')[0])).toEqual({}) // URL with no parameters
			expect(getUrlParam('page')).toEqual('')
			expect(getUrlParam('filter', undefined, ['filter'])).toEqual([])
		})

		it('should return all URL parameters from browser location', () => {
			expect(getUrlParam()).toEqual(params)
		})

		it('should return specified parameter by name', () => {
			expect(getUrlParam('page')).toEqual(params.page)
			expect(getUrlParam('sort')).toEqual(params.sort)
			expect(getUrlParam('filter')).toEqual(params.filter)
		})

		it('should force a parameter value to be array', () => {
			expect(getUrlParam('page', undefined, true)).toEqual(['2'])
			expect(getUrlParam('unknown', undefined, true)).toEqual([])
		})

		it('should handle array values even when specific name is not specified in asArray argument', () => {
			const result = getUrlParam('filter', undefined, [])
			expect(result).toEqual(params.filter)
		})
	})
}

runTests(false)

// run the same tests but force use of getUrlParamRegex
runTests(true)
