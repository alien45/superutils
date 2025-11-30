/** Map entries as array */
export const getEntries = <K, V>(map: Map<K, V>) => [
	...(map?.entries?.() || []),
]
export default getEntries
