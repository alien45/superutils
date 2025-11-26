/**
 * Clears clutter from strings
 *
 * - removes trailing & leading whitespaces
 * - removes empty/whitespace-only lines
 * - converts multiline strings to single line
 *
 * @param	text	string to clear clutter from
 * @param	lineSeparator	(optional) string to use as line separator. Default: single space `' '`
 *
 * @returns cleaned string
 */
export const clearClutter = (text: string, lineSeparator = ' ') =>
	`${text}`
		.split('\n')
		.map(ln => ln.trim())
		.filter(Boolean)
		.join(lineSeparator)
export default clearClutter
