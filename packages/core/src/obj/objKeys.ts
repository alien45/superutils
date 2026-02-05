import fallbackIfFails from '../fallbackIfFails'

/**
 * Get object property names/keys
 *
 * @param obj target object
 * @param sorted (optional) Whether to sort the keys. Default: `true`
 * @param includeSymbols (optional) Whether to include `Symbol` object. Default: `false`
 */
export const objKeys = <T extends object, Include extends true | false = true>(
	obj: T,
	sorted = true,
	includeSymbols: Include = true as Include,
) =>
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
	fallbackIfFails(
		() => [
			...((includeSymbols && Object.getOwnPropertySymbols(obj)) || []),
			...(sorted ? Object.keys(obj).sort() : Object.keys(obj)),
		],
		[],
		[],
	) as Include extends true ? (keyof T)[] : (keyof T)[] & string[]
export default objKeys
