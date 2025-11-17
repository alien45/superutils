/**
 * @name	clearClutter
 * @summary clears clutter from strings
 *
 * - removes trailing, leading & unnecessary whitespaces
 * - removes replaces new line characters (`\n`) with whitespaces
 */
export const clearClutter = (x: string) =>
	`${x}`
		.split('\n')
		.map(y => y.trim())
		.filter(Boolean)
		.join(' ')
export default clearClutter
