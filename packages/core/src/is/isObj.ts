/**
 * Check if value is an object.
 *
 *
 * @param x value to check
 * @param strict (optional) whether to exclude anything other than plain object. Eg: Array, Map, RegExp, Set etc.
 *
 * Default: `true`
 *
 * Valid objects:
 * - object literals (Prototype: `Object.prototype`)
 * - objects created using `Object.create(null)`
 *
 * Valid when strict mode off (false):
 * - all of above
 * - buit-in objects like Date, Error, Map, Set, Uint8Array etc
 * - custom Class instances
 * - objects created using `Object.create(object)`
 *
 * Always invalid:
 * - `null`, `undefined`, `NaN`, `Infinity`
 * - primitive: String, Number, BigInt...
 *
 * @example
 * ```javascript
 * import { isObj } from '@superutils/core'
 *
 * console.log(isObj(null)) // false
 * console.log(isObj(undefined)) // false
 * console.log(isObj(NaN)) // false
 * console.log(isObj(Infinity)) // false
 * console.log(isObj({})) // true
 * console.log(isObj({ a: 1, b: 2})) // true
 * console.log(isObj(Object.create(null))) // true
 * console.log(isObj(new Map())) // false (strict)
 * console.log(isObj(new Map(), false)) // true (non-strict)
 * console.log(isObj(new Error('error'))) // false (strict)
 * console.log(isObj(new Error('error'), false)) // true (non-strict)
 * class Test { a = 1 } // a custom class
 * console.log(isObj(new Test())) // false
 * console.log(isObj(new Test(), false)) // true
 * ```
 */
export const isObj = <T = Record<PropertyKey, unknown>>(
	x: unknown,
	strict = true,
): x is T =>
	!!x // excludes null, NaN, Infinity....
	&& typeof x === 'object'
	&& (!strict
		// excludes Array, BigInt, Uint8Array, Map, Set...
		|| [
			Object.prototype,
			null, // when an object is created using `Object.create(null)`
		].includes(Object.getPrototypeOf(x) as object))

export default isObj
