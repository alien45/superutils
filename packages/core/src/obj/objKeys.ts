import fallbackIfFails from '../fallbackIfFails'

/** Get object keys */
export const objKeys = <
	Key extends keyof any,
	Include extends true | false = true,
>(
	obj: Record<Key, unknown>,
	includeSymbols: Include = true as Include,
) =>
	fallbackIfFails(
		() => [
			...((includeSymbols && Object.getOwnPropertySymbols(obj)) || []),
			...Object.keys(obj).sort(),
		],
		[],
		[],
	) as Include extends true ? Key[] : string[]
export default objKeys
