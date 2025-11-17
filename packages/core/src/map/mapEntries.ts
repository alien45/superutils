/** Map entries as array */
export const mapEntries = <K, V>(map: Map<K, V>) => [
	...(map?.entries?.() || []),
]
export default mapEntries
