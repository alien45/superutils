import { describe, expect, it } from 'vitest'
import PromisE from '../src'
import browser from '../src/browser'

describe('browser-entry', () => {
	it('should export PromisE as default', () => {
		expect(browser).toEqual(PromisE)
	})
})
