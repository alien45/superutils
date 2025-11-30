import { IterableList } from './types'

/** Get {@link IterableList} keys as array */
export const getKeys = <K, V>(data: IterableList<K, V>) => [
	...(data?.keys?.() || []),
]
export default getKeys
