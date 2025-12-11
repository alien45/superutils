/**
 * Convert comma separated strings to array
 *
 * @param value value to convert
 * @param seperator (optional) only used when value is a string. Default: `","`
 *
 * @returns Array
 */
export const strToArr = (value: unknown, seperator = ',') =>
	(typeof value === 'string' && value.split(seperator).filter(Boolean)) || []

export default strToArr
