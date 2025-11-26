import { IterableList } from '../iterable/types'

/** Get Map values as Array */
export const mapValues = <K, V>(data: IterableList<K, V>) => [
	...(data?.values?.() || []),
]
export default mapValues
