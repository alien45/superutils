/** Map values as array */
export const mapValues = <K, V>(map: Map<K, V>) => [...(map?.values?.() || [])]
export default mapValues
