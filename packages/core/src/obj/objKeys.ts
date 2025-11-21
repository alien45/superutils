import fallbackIfFails from '../fallbackIfFails'
import { RecordKey } from '../types'

/** Get object keys */
export const objKeys = <
	Key extends RecordKey,
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
