import { describe, expect, it } from 'vitest'
import { randomInt } from '../../src'

describe('randomInt', () => {
	it('generates random integers within the specified range', () => {
		const results = new Array(100)
			.fill(0)
			.map((_, i) => randomInt(i, i + 100))
		const allInRange = results.every((num, i) => num >= i && num < i + 100)
		expect(allInRange).toBe(true)
	})

	it('generates random integers with default parameters', () => {
		const results = new Array(100).fill(0).map(() => randomInt())
		const allInRange = results.every(
			num => num >= 0 && num < Number.MAX_SAFE_INTEGER,
		)
		expect(allInRange).toBe(true)
	})
})
