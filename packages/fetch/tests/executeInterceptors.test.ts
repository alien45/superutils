import { describe, expect, it } from 'vitest'
import { noop } from '../../core/src'
import { executeInterceptors } from '../src'

describe('executeInterceptors', () => {
	it('run return the value if no interceptors provided', async () => {
		await expect(executeInterceptors(1)).resolves.toBe(1)
	})

	it('run return the original value after executing non-transformative interceptors', async () => {
		const promise = executeInterceptors(1, undefined, [noop, noop, noop])
		await expect(promise).resolves.toBe(1)
	})

	it('run return the most recent value received after request is aborted', async () => {
		const abortCtrl = new AbortController()
		const promise = executeInterceptors(1, abortCtrl.signal, [
			() => 2,
			() => {
				abortCtrl.abort()
				return 3
			},
			() => 4,
		])
		await expect(promise).resolves.toBe(3)
	})

	it('run return the transformed value after executing interceptors', async () => {
		const promise = executeInterceptors(1, undefined, [
			x => x + 1,
			x => x * 2,
			x => x - 3,
		])
		await expect(promise).resolves.toBe(1)
	})

	it('run return the transformed value after gracefully executing interceptors that throw errors', async () => {
		const promise = executeInterceptors(1, undefined, [
			x => x + 1,
			x => {
				x = x * 2
				throw new Error('Interceptor error')
			},
			x => x - 3,
		])
		await expect(promise).resolves.toBe(-1)
	})

	it('run return the transformed value after gracefully executing interceptors that throw errors', async () => {
		const promise = executeInterceptors({ value: 1 }, undefined, [
			x => {
				x.value = x.value + 1
			},
			x => {
				x.value = x.value * 2
				// even though error is thrown, the previous transformation should persist
				// because of graceful handling and use of non-primitive object
				throw new Error('Interceptor error')
			},
			x => {
				x.value = x.value - 3
			},
		])
		await expect(promise).resolves.toEqual({ value: 1 })
	})
})
