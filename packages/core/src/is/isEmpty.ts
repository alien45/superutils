import { isNumber } from './isNumber'

/**
 * Check if variable contains empty, null-ish value.
 *
 * Depending on the type certain criteria applies:
 * - `null` | `undefined`: always empty
 * - `String`: empty text or only white-spaces
 * - `Number`: non-finite or NaN
 * - `Array` | `Uint8Array` | `Map` | `Set` | `Object`: contains zero items/properties
 * - `Boolean` | `Function` | `Symbol` | `BigInt`: never empty
 *
 * @param x The value to check for emptiness.
 * @param nonNumerable (optional) when `true`, considers non-enumerable properties
 * while checking objects for emptiness. Default: `false`
 * @param fallback (optional) value to return when type is unrecognized.
 * Default: `false`
 *
 * @example Check strings
 * ```typescript
 * import { isEmpty } from '@superutils/core'
 * isEmpty('') // true
 * isEmpty(' ') // true
 * isEmpty(`
 *
 *
 * `) // true
 * isEmpty('    not empty   ') // false
 * isEmpty(`
 *
 *     not empty
 *
 * `) // false
 * ```
 *
 * @example check numbers
 * ```typescript
 * import { isEmpty } from '@superutils/core'
 * isEmpty(NaN) // true
 * isEmpty(Infinity) // true
 * isEmpty(0) // false
 * ```
 *
 *
 * @example check objects (includes arrays, maps & sets)
 * ```typescript
 * import { isEmpty } from '@superutils/core'
 * isEmpty({}) // true
 * isEmpty([]) // true
 * isEmpty(new Map()) // true
 * isEmpty(new Set()) // true
 * ```
 */
export const isEmpty = (
	x: unknown,
	nonNumerable = false,
	fallback: boolean | 0 | 1 = false,
) => {
	if (x === null || x === undefined) return true

	switch (typeof x) {
		case 'number':
			return !isNumber(x)
		case 'string':
			return !x.replaceAll('\t', '').trim().length
		case 'boolean':
		case 'bigint':
		case 'symbol':
		case 'function':
			return false // never empty
	}

	if (x instanceof Date) return Number.isNaN(x.getTime())
	if (x instanceof Map || x instanceof Set) return !x.size
	if (Array.isArray(x) || x instanceof Uint8Array) return !x.length
	if (x instanceof Error) return !x.message.length

	const proto: unknown = typeof x === 'object' && Object.getPrototypeOf(x)
	if (proto === Object.prototype || proto === null) {
		return nonNumerable
			? !Object.getOwnPropertyNames(x).length
			: !Object.keys(x as object).length
	}
	return fallback
}

/**
 * Safe version of {@link isEmpty} with extended type checks and cross-realm handling.
 *
 * CAUTION: much slower than {@link isEmpty} due to use of Object.prototype.toString.call()
 *
 * Cross-realm means objects created in different JavaScript contexts.
 * Eg: iframe, node vm context, worker context, browser extensions etc.
 *
 *
 * @param x The value to check for emptiness.
 *
 * @returns `true` if the value is considered empty, `false` otherwise.
 */
export const isEmptySafe = (x: unknown, numberableOnly = false) => {
	const empty = isEmpty(x, numberableOnly, 0)
	if (empty !== 0) return empty

	switch (Object.prototype.toString.call(x)) {
		case '[object Uint8Array]':
			return !(x as Uint8Array).length
		case '[object Date]':
			return Number.isNaN((x as Date).getTime())
		case '[object Map]':
			return !(x as Map<unknown, unknown>).size
		case '[object Object]':
			return !Object.keys(x as object).length
		case '[object Set]':
			return !(x as Set<unknown>).size
		default:
			// for all other cases, value is defined, therefore, it is presumed not empty
			return false
	}
}

export default isEmpty
