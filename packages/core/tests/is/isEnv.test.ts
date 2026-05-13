import { describe, expect, it, vi, afterEach } from 'vitest'
import {
	isEnvBrowser,
	isEnvBun,
	isEnvDeno,
	isEnvMobile,
	isEnvNode,
	isEnvTouchable,
} from '../../src'

describe('isEnvBrowser', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('should return true when in browser', () => {
		vi.stubGlobal('window', { navigator: {}, document: {} })
		expect(isEnvBrowser()).toBe(true)
	})
	it('should return false when not in browser', () => {
		vi.stubGlobal('window', undefined)
		expect(isEnvBrowser()).toBe(false)
	})
})

describe('isEnvBun', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('should return true when in Bun', () => {
		vi.stubGlobal('Bun', {})
		vi.stubGlobal('process', { versions: { bun: '1.0.0' } })
		expect(isEnvBun()).toBe(true)
	})

	it('should return false when not in Bun', () => {
		vi.stubGlobal('Bun', undefined)
		expect(isEnvBun()).toBe(false)
	})
})

describe('isEnvDeno', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('should return true when in Deno', () => {
		vi.stubGlobal('Deno', { version: '1.2.3' })
		expect(isEnvDeno()).toBe(true)
	})

	it('should return false when not in Deno', () => {
		vi.stubGlobal('Deno', undefined)
		expect(isEnvDeno()).toBe(false)
	})
})

describe('isEnvMobile', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('should return true for mobile user agents', () => {
		vi.stubGlobal('window', { navigator: {}, document: {} })
		vi.stubGlobal('navigator', { userAgent: 'iPhone' })
		expect(isEnvMobile()).toBe(true)
	})

	it('should return true when falling back to window.opera', () => {
		vi.stubGlobal('window', {
			navigator: {},
			document: {},
			opera: 'Opera Mini',
		})
		vi.stubGlobal('navigator', { userAgent: '' })
		expect(isEnvMobile()).toBe(true)
	})

	it('should return false for desktop user agents', () => {
		vi.stubGlobal('window', { navigator: {}, document: {} })
		vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0' })
		expect(isEnvMobile()).toBe(false)
	})
})

describe('isEnvNode', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('should return false when not in node or equivalent', () => {
		vi.stubGlobal('process', undefined)
		expect(isEnvNode()).toBe(false)
	})
	it('should return true when in Node', () => {
		vi.stubGlobal('process', { versions: { node: '20.0.0' } })
		expect(isEnvNode()).toBe(true)
	})

	it('should correctly handle strict mode', () => {
		vi.stubGlobal('process', { versions: { node: '20.0.0', bun: '1.0.0' } })
		expect(isEnvNode(false)).toBe(true)
		expect(isEnvNode(true)).toBe(false)
	})
})

describe('isEnvTouchable', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('should return false when not in browser', () => {
		vi.stubGlobal('window', undefined)
		expect(isEnvTouchable()).toBe(false)
	})
	it('should return false when in "window" is available but not documentElement', () => {
		vi.stubGlobal('window', {})
		expect(isEnvTouchable()).toBe(false)
	})
	it('should return true when in browser with touch support', () => {
		vi.stubGlobal('window', {
			document: {
				documentElement: {
					ontouchstart: true,
				},
			},
		})
		expect(isEnvTouchable()).toBe(true)
	})
})
