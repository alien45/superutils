/**
 * @name	randomInt
 * @summary generates random number within a range
 *
 * @param min lowest number
 * @param max highest number
 */
export const randomInt = (min = 0, max = Number.MAX_SAFE_INTEGER) =>
	parseInt(`${Math.random() * (max - min) + min}`)

export default randomInt
