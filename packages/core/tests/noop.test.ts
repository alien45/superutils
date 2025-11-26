import { describe, expect, it } from 'vitest'
import noop, { noopAsync } from '../src/noop'

describe('noop', () => {
	it('should do nothing', () => {
		expect(noop()).toBeUndefined()
	})
})

describe('noopAsync', () => {
	it('should do nothing', async () => {
		await expect(noopAsync()).resolves.toBe(undefined)
	})
})
