import { isValidDate } from './is'

/**
 * Convert timestamp to `input["datetime-local"]` compatible format.
 *
 * ---
 * @example Convert ISO datetime string
 * ```typescript
 * toDatetimeLocal('2000-01-01T01:01:01.001Z')
 * // result: "2000-01-01T01:01" // assuming local timezone is UTC+0
 * ```
 *
 * @example Convert Date object
 * ```typescript
 * const date = new Date('2000-01-01T01:01:01.001Z')
 * toDatetimeLocal(date)
 * // result: "2000-01-01T01:01" // assuming local timezone is UTC+0
 * ```
 *
 * @example Convert Unix Timestamp (epoch time) number
 * ```typescript
 * const epoch = new Date('2000-01-01T01:01:01.001Z').getTime()
 * toDatetimeLocal(epoch)
 * // result: "2000-01-01T01:01" // assuming local timezone is UTC+0
 * ```
 */
export const toDatetimeLocal = (dateStr: string | Date | number) => {
	const date = new Date(dateStr)
	if (!isValidDate(date)) return ''

	const year = date.getFullYear()
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const day = date.getDate().toString().padStart(2, '0')
	const hours = date.getHours().toString().padStart(2, '0')
	const minutes = date.getMinutes().toString().padStart(2, '0')

	const res = `${year}-${month}-${day}T${hours}:${minutes}`
	return res as `${number}-${number}-${number}T${number}:${number}`
}
export default toDatetimeLocal

new Date().getTime()
