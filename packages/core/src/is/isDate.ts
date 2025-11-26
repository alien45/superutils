/** Check if value is instance of Date */
export const isDate = (x: unknown): x is Date => x instanceof Date

/**
 * Check if a value is a valid date.
 *
 * @param   date The value to check. Can be a Date object or a string.
 *
 * @returns `true` if the value is a valid date, `false` otherwise.
 */
export const isDateValid = (date: unknown) => {
	const dateIsStr = typeof date === 'string'
	if (!dateIsStr && !isDate(date)) return false

	const dateObj = new Date(date)
	// avoids 'Invalid Date'
	if (Number.isNaN(dateObj.getTime())) return false
	// provided dateOrStr is a Date object and has a valid timestamp
	if (!dateIsStr) return true

	// Hack to catch `new Date(dateOrStr)` side-effects. Eg: converting '2021-02-31' to '2021-03-03'
	const [original, converted] = [date, dateObj.toISOString()].map(y =>
		y.replace(/[TZ]/g, '').substring(0, 10),
	)
	return original === converted
}

export default isDate
