/** Map keys as array */
export const mapKeys = <K, V>(map: Map<K, V>) => [...(map?.keys?.() || [])]
export default mapKeys
