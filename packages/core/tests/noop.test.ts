import { describe, expect, it } from 'vitest'
import noop from '../src/noop'

describe('noop', () => {
	it('should do nothing', () => {
		expect(noop()).toBeUndefined()
	})
})
