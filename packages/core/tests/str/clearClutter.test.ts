import { describe, expect, it } from 'vitest'
import { clearClutter } from '../../src'

describe('clearClutter', () => {
	it('should clear clutter from strings', () => {
		expect(clearClutter('   Hello, World!   ')).toBe('Hello, World!')

		// multiline texts with tabs and spaces
		expect(
			clearClutter(`
                       Hello,   
                   World!   
            `),
		).toBe('Hello, World!')
		expect(
			clearClutter(`
                          

            	`),
		).toBe('')
	})
	it('should return convert non-string value using template literal', () => {
		expect(clearClutter(null as any)).toBe('null')
		expect(clearClutter(undefined as any)).toBe('undefined')
		expect(clearClutter(123 as any)).toBe('123')
		expect(clearClutter(true as any)).toBe('true')
		expect(clearClutter(false as any)).toBe('false')
		expect(clearClutter({ a: 1 } as any)).toBe('[object Object]')
		expect(clearClutter([1, 2, 3] as any)).toBe('1,2,3')
		expect(
			// multiline texts with tabs and spaces
			clearClutter([
				`   
					1`,
				' 2 ',
				`3
				   
					`,
			] as any),
		).toBe('1, 2 ,3')
		expect(clearClutter(new Map() as any)).toBe('[object Map]')
		expect(clearClutter(new Set() as any)).toBe('[object Set]')
	})
})
