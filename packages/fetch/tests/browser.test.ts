import { describe, expect, it } from 'vitest'
import browser from '../src/browser'

describe('browser-entry', () => {
	it('should export fetch as default', () => {
		expect(browser).toEqual(expect.any(Function))
	})
})
