import fallbackIfFails from '../fallbackIfFails'
import { asAny } from '../forceCast'
import { isEmpty, isObj, isSymbol } from '../is'
import objKeys from './objKeys'

/** Clone any value by first strinfigying and then parsing back  */
const clone = <T>(value: T, fallback = 'null') =>
	JSON.parse(fallbackIfFails(JSON.stringify, [value], fallback)) as T

/**
 * @name	objCopy
 * @summary deep-copy an object to another object
 *
 * @param input input object
 * @param ignoreKeys (optional) input peroperties to be ignored. Prevents output's property to be overriden.
 *
 * For child object properties use "." (dot) separated path.
 *
 * Eg: `"child.grandchild1"` where input is `{ child: { grandchild1: 1, grandchild2: 2 }}`
 *
 * @param output (optional) output object
 * @param override (optional) whether to allow override output (if provided) properties.
 * Accepted values:
 * `true`: input property will override output property
 * `false`: no overriding if output contains the property. Even if the property value is `undefined`.
 * `"empty"`: only allow overriding output property if it's value is empty by using {@link isEmpty}.
 *
 * Default: `false`
 *
 *
 * @returns copied and/or merged object
 */
export const objCopy = <
	Key extends string | symbol,
	T extends Record<Key, unknown>,
	IgnoredKey extends Key | string,
>(
	input: T,
	output?: Record<keyof any, unknown>,
	ignoreKeys?: IgnoredKey[] | Set<IgnoredKey>,
	override: boolean | 'empty' = false,
	recursive = true,
) => {
	if (!isObj(output)) output = {} as T
	if (!isObj(input)) return output

	const _ignoreKeys = new Set(ignoreKeys || [])
	const inKeys = (objKeys(input, true) as IgnoredKey[]).filter(
		x => !_ignoreKeys.has(x),
	)
	for (let i = 0; i < inKeys.length; i++) {
		const key = inKeys[i] as Key
		const value = input[key]

		const skip =
			output.hasOwnProperty(key)
			&& (!override || (override === 'empty' && !isEmpty(output[key])))
		if (skip) continue

		const isPrimitive =
			[undefined, null, Infinity, NaN].includes(value as any)
			|| !isObj(value, false)
		if (isPrimitive) {
			// directly assign any primitive types
			output[key] = value
			continue
		}

		output[key] = (() => {
			switch (Object.getPrototypeOf(value)) {
				case Array.prototype:
					return clone(value, '[]')
				case ArrayBuffer.prototype:
					return asAny<ArrayBuffer>(value).slice(0)
				case Date.prototype:
					return new Date(asAny<Date>(value).getTime())
				case Map.prototype:
					const arr2d = Array.from(
						asAny<Map<unknown, unknown>>(value),
					)
					return new Map(clone(arr2d, '[]'))
				case RegExp.prototype:
					return new RegExp(asAny<RegExp>(value))
				case Set.prototype:
					const arr = Array.from(asAny<Set<unknown>>(value))
					return new Set(clone(arr))
				case Uint8Array.prototype:
					return new Uint8Array([...asAny<Uint8Array>(value)])
				case URL.prototype:
					return new URL(asAny<URL>(value))
				default:
					break
			}

			if (!recursive || isSymbol(key)) return clone(value)

			const ignoreChildKeys = [..._ignoreKeys]
				.map(
					x =>
						!isSymbol(x)
						&& x.startsWith(`${key as string}.`)
						&& x.split(`${key as string}.`)[1],
				)
				.filter(Boolean) as Key[]
			if (!ignoreChildKeys.length) return clone(value)

			return objCopy(
				value as T,
				output[key] as T,
				ignoreChildKeys,
				override,
				recursive,
			)
		})()
	}

	return output
}
