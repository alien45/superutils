import { isArr, isFn, isObj } from '../is'
import { ObjReadOnlyConfig } from './types'

/**
 * Constructs a read-only proxy of an object.
 * Prevents modification or deletion of existing properties based on configuration.
 *
 * Applies only to top-level properties.
 *
 * @param obj input object
 * @param config (optional) extra configuration
 * @param config.add (optional) Whether to allow adding new properties. Default: `false`
 * @param config.revocable (optional) Whether to create a revokable proxy. Default: `false`
 * @param config.silent (optional) whether to throw error when a write operation is rejected. Default: `true`
 *
 * @returns	Readonly object or object containing readonly object and revoke function
 *
 * @example
 * Create a readonly object and silently ignore any attempt of property add, update and delete operations
 *
 * ```javascript
 * import { objReadOnly } from '@superutils/core'
 *
 * const obj = objReadOnly({ a: 1, b: 2})
 * obj.a = 3
 * delete obj.a
 * console.log(obj.a) // 1
 * obj.c = 4
 * console.log(obj.c) // undefined
 * ```
 *
 * @example
 * Create a readonly object and throw error on any attempt of property add, update and delete operations
 *
 * ```javascript
 * import { fallbackIfFails, objReadOnly } from '@superutils/core'
 *
 * const obj = objReadOnly(
 * 	{ a: 1, b: 2},
 *  { silent: false }
 * )
 *
 * try {
 * 	obj.a = 3
 * } catch(err) { console.log('update failed:', err.message) }
 *
 * try {
 * 	delete obj.a
 * } catch(err) { console.log('delete failed:', err.message) }
 *
 * try {
 * 	obj.c = 4
 * } catch(err) { console.log('add failed:', err.message) }
 * console.log(obj) // { a: 1, b: 2 }
 * ```
 *
 * @example
 * Create a readonly object and throw error on any attempt of property update and delete operations
 * but allow adding new properties
 *
 * ```javascript
 * import { fallbackIfFails, objReadOnly } from '@superutils/core'
 *
 * const obj = objReadOnly(
 * 	{ a: 1, b: 2},
 *  {
 * 		add: true,
 * 		silent: false
 * 	}
 * )
 * 	obj.c = 4
 *  console.log(obj.c) // 4
 * ```
 */
export const objReadOnly = <
	T extends object | unknown[],
	Revocable extends true | false = false,
	Result = Revocable extends true ? ReturnType<typeof Proxy.revocable<T>> : T,
>(
	obj: T,
	config?: ObjReadOnlyConfig<T, Revocable>,
): Result => {
	if (!isObj(obj, false)) obj = {} as T

	const { add, revocable, silent = true } = config ?? {}

	const [typeTitle, keyTitle] = isArr(obj)
		? ['array', 'index']
		: ['object', 'property name']
	function handleSetProp(obj: T, key: string | symbol, value: unknown) {
		const isUpdate = obj[key as keyof T] !== undefined

		if (isUpdate && silent) return true

		const allowAddition =
			!isUpdate && (!isFn(add) ? add : add(obj, key, value))
		// in strict mode, prevents adding or updating properties
		const shouldThrow = !silent && (isUpdate || !allowAddition)
		if (shouldThrow)
			throw new TypeError(
				`Mutation not allow on read-only ${typeTitle} ${keyTitle}: ${key.toString()}`,
			)
		// Ignore attempt to update property
		if (!allowAddition) return true

		obj[key as keyof T] = value as T[keyof T]

		return true
	}
	const proxyHandler: ProxyHandler<T> = {
		get: (obj, key) => obj[key as keyof T],
		set: handleSetProp,
		defineProperty: (obj, key, { value }) => handleSetProp(obj, key, value),
		// Prevent removal of properties
		deleteProperty: (obj, key) => {
			if (!silent && obj.hasOwnProperty(key)) {
				throw new Error(
					`Mutation not allow on read-only ${typeTitle} ${keyTitle}: ${key.toString()}`,
				)
			}
			return true
		},
	}

	return (
		revocable
			? Proxy.revocable<T>(obj, proxyHandler)
			: new Proxy(obj, proxyHandler)
	) as Result
}
export default objReadOnly
