import { noopAsync } from '../noop'
import { AsyncFn } from '../types'

/** Check if value is a function */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isFn = <T extends (...args: any[]) => any>(x: unknown): x is T =>
	typeof x === 'function'

/**
 * Check if value is an Async function.
 * Caution: May not work at runtime when Babel/Webpack is used due to code compilation.
 *
 * @example
 * ```javascript
 * import { isAsyncFn } from '@superutils/core'
 *
 * isAsyncFn(async () => {}) // result: true
 * isAsyncFn(() => {}) // result: false
 * ```
 */
export const isAsyncFn = <TData = unknown, TArgs extends unknown[] = unknown[]>(
	x: unknown,
): x is AsyncFn<TData, TArgs> =>
	x instanceof noopAsync.constructor
	&& (x as Record<PropertyKey, unknown>)[Symbol.toStringTag]
		=== 'AsyncFunction'

export default isFn
