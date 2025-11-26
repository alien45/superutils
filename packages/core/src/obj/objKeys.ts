import fallbackIfFails from '../fallbackIfFails'

/**
 * Get object property names/keys
 *
 * @param obj target object
 * @param sorted (optional) Whether to sort the keys. Default: `true`
 * @param includeSymbols (optional) Whether to include `Symbol` object. Default: `false`
 */
export const objKeys = <
	Key extends PropertyKey,
	Include extends true | false = true,
>(
	obj: Record<Key, unknown>,
	sorted = true,
	includeSymbols: Include = true as Include,
) =>
	fallbackIfFails(
		() => [
			...((includeSymbols && Object.getOwnPropertySymbols(obj)) || []),
			...(sorted ? Object.keys(obj).sort() : Object.keys(obj)),
		],
		[],
		[],
	) as Include extends true ? Key[] : Key[] & string[]
export default objKeys
