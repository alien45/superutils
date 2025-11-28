import { IterableList } from './types'

/** Get Map values as Array */
export const getValues = <K, V>(data: IterableList<K, V>) => [
	...(data?.values?.() || []),
]
export default getValues
