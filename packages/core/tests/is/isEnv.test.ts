import { describe, expect, it, vi } from 'vitest'
import { isEnvBrowser, isEnvNode, isEnvTouchable } from '../../src'

describe('isEnvBrowser', () => {
	it('should return true when in browser', () => {
		vi.stubGlobal('window', { document: {} })
		expect(isEnvBrowser()).toBe(true)
		vi.unstubAllGlobals()
	})
	it('should return false when not in browser', () => {
		expect(isEnvBrowser()).toBe(false)
	})
})

describe('isEnvNode', () => {
	it('should return false when not in node or equivalent', () => {
		vi.stubGlobal('process', undefined)
		expect(isEnvNode()).toBe(false)
		vi.unstubAllGlobals()
	})
	it('should return true when not in node or equivalent', () => {
		expect(isEnvNode()).toBe(true)
	})
})

describe('isTouchable', () => {
	it('should return false when not in browser', () => {
		vi.stubGlobal('window', undefined)
		expect(isEnvTouchable()).toBe(false)
		vi.unstubAllGlobals()
	})
	it('should return false when in "window" is available but not documentElement', () => {
		vi.stubGlobal('window', {})
		expect(isEnvTouchable()).toBe(false)
		vi.unstubAllGlobals()
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
		vi.unstubAllGlobals()
	})
})
