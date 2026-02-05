import fallbackIfFails from '../fallbackIfFails'
import { isEmpty, isFn, isObj, isSymbol } from '../is'
import objKeys from './objKeys'

/** Clone any value by first strinfigying and then parsing back  */
const clone = <T>(value: T, fallback = 'null') =>
	JSON.parse(fallbackIfFails(JSON.stringify, [value], fallback)) as T

/**
 * Deep-copy an object to another object
 *
 * @param input input object
 * @param output (optional) output object
 * @param ignoreKeys (optional) input peroperties to be ignored. Prevents output's property to be overriden.
 *
 * For child object properties use "." (dot) separated path.
 *
 * Eg: `"child.grandchild1"` where input is `{ child: { grandchild1: 1, grandchild2: 2 }}`
 *
 * @param override (optional) whether to allow override output properties.
 * This will only be used if `output` object is provided and has own property.
 * Accepted values:
 * - `true`: input property will override output property
 * - `false`: no overriding if output contains the property. Even if the property value is `undefined`.
 * - `"empty"`: only allow overriding output property if it's value is empty by using {@link isEmpty}.
 * - `function`: decide whether to override on a per property basis.
 *
 * Function Arguments:
 *     1. key: current property name/key
 *     2. outputValue: `output` property value
 *     3. inputValue: `input` property value
 *
 * Default: `false`
 *
 * @param recursive (optional) whether to recursively copy nested objects. Default: `false`
 *
 *
 * @returns copied and/or merged object
 *
 * ```javascript
 * import { objCopy } from '@superutils/core'
 *
 * const source = {
 * 	a: 1,
 * 	b: 2,
 * 	c: 3,
 * 	x: {
 * 		a: 1,
 * 		b: 2,
 * 	},
 * }
 * const dest = {
 * 	d: 4,
 * 	e: 5,
 * }
 * const copied = objCopy(
 * 	source,
 * 	dest,
 * 	['a', 'x.b'], // exclude source property
 * 	'empty', // only override if dest doesn't have the property or value is "empty" (check `is.emtpy()`)
 * 	true, // recursively copies child objects. If false, child objects are copied by reference.
 * )
 * console.log({ copied })
 * // Result:
 * // {
 * //     b: 2,
 * //     c: 33,
 * //     d: 4,
 * //     e: 5,
 * // }
 * console.log(dest === copied) // true (dest is returned)
 * ```
 */
export const objCopy = <
	Key extends PropertyKey,
	InValue,
	OutValue,
	IgnoredKey extends Key | string,
>(
	input: Record<Key, InValue>,
	output?: Record<PropertyKey, OutValue>,
	ignoreKeys?: IgnoredKey[] | Set<IgnoredKey>,
	override:
		| boolean
		| 'empty'
		| ((
				key: Key,
				outputValue: OutValue,
				inputValue: InValue,
		  ) => boolean) = false,
	recursive = true,
) => {
	const _output = (isObj(output) ? output : {}) as Record<
		PropertyKey,
		unknown
	>
	if (!isObj(input)) return _output

	const _ignoreKeys = new Set(ignoreKeys ?? [])
	const inKeys = objKeys(input, true, true).filter(
		x => !_ignoreKeys.has(x as IgnoredKey),
	)

	for (const _key of inKeys) {
		const key = _key // as Key
		const value = input[key]

		const skip =
			_output.hasOwnProperty(key)
			&& (override === 'empty'
				? !isEmpty(_output[key])
				: isFn(override)
					? !override(key, _output[key] as OutValue, value)
					: true)
		if (skip) continue

		const isPrimitive =
			[undefined, null, Infinity, NaN].includes(value as undefined)
			|| !isObj(value, false)
		if (isPrimitive) {
			// directly assign any primitive types
			_output[key] = value
			continue
		}

		_output[key] = (() => {
			switch (Object.getPrototypeOf(value)) {
				case Array.prototype:
					return clone(value, '[]')
				case ArrayBuffer.prototype:
					return (value as unknown as ArrayBuffer).slice(0)
				case Date.prototype:
					return new Date((value as unknown as Date).getTime())
				case Map.prototype:
					return new Map(
						clone(
							Array.from(
								value as unknown as Map<unknown, unknown>,
							),
							'[]',
						),
					)
				case RegExp.prototype:
					return new RegExp(value as unknown as RegExp)
				case Set.prototype:
					return new Set(
						clone(Array.from(value as unknown as Set<unknown>)),
					)
				case Uint8Array.prototype:
					return new Uint8Array([...(value as unknown as Uint8Array)])
				case URL.prototype:
					return new URL(value as unknown as URL)
				default:
					break
			}

			if (isSymbol(key) || !recursive) return clone(value)

			const ignoreChildKeys = [..._ignoreKeys]
				.map(
					x =>
						String(x).startsWith(String(key).concat('.'))
						&& String(x).split(String(key).concat('.'))[1],
				)
				.filter(Boolean) as string[]
			if (!ignoreChildKeys.length) return clone(value)

			return objCopy(
				value as Record<Key, InValue>,
				_output[key] as Record<PropertyKey, OutValue>,
				ignoreChildKeys as IgnoredKey[],
				override,
				recursive,
			)
		})()
	}

	return _output
}
