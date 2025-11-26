import { isArr, isFn, isObj } from '../is'
import { ReadOnlyConfig } from './types'

/**
 * Constructs a new read-only object where only new properties can be added.
 *
 * Applies only to the top-level properties.
 *
 * @param obj input object
 * @param config (optional) extra configuration
 * @param config.add (optional) Whether to allow adding new properties. Default: `false`
 * @param config.revocable (optional) Whether to create a revokable proxy. Default: `false`
 * @param config.silent (optional) whether to throw error when a write operation is rejected. Default: `false`
 *
 * @returns	Readonly object or object containing readonly object and revoke function
 */
export const objReadOnly = <
	T extends object | unknown[],
	Revocable extends true | false = false,
	Result = Revocable extends true ? ReturnType<typeof Proxy.revocable<T>> : T,
>(
	obj: T,
	config?: ReadOnlyConfig<T, Revocable>,
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
