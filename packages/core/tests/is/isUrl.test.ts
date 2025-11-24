import { describe, expect, it } from 'vitest'
import { isUrl, isUrlValid } from '../../src'

describe('isUrl', () => {
	it('should return true for URL objects', () => {
		expect(isUrl(new URL('http://google.com'))).toBe(true)
	})
	it('should return false for non-URL objects', () => {
		expect(isUrl('http://google.com')).toBe(false)
	})
})

describe('isUrlValid', () => {
	it('should return false for universally invalid URL values regardless of strict mode', () => {
		const invalidUrlValues = [
			undefined,
			null,
			'',
			new Map(),
			'some string',
			'http://',
			'www.google.com',
			'http://www.google com',
			'http://www google.com',
		]
		invalidUrlValues.forEach(url => {
			expect(isUrlValid(url, true)).toBe(false)
			expect(isUrlValid(url, false)).toBe(false)
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
			expect(isUrlValid(url, true)).toBe(true)
			expect(isUrlValid(url, false)).toBe(true)
		})
	})

	it('should return false for loosely or situationally valid URL when in strict mode', () => {
		const invalidStrictUrls = ['http://www.google.com ', 'http://www']
		invalidStrictUrls.forEach(url => {
			expect(isUrlValid(url, true)).toBe(false)
		})
	})

	it('should return true for loosely or situationally valid URL when not in strict mode', () => {
		const invalidStrictUrls = ['http://www.google.com ', 'http://www']
		invalidStrictUrls.forEach(url => {
			expect(isUrlValid(url, false)).toBe(true)
		})
	})
})
