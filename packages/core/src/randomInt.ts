/**
 * @name	randomInt
 * @summary generates random number within a range
 *
 * @param min lowest number
 * @param max highest number
 * @param radix (optional) A value between 2 and 36 that specifies the base of the number
 */
export const randomInt = (min = 0, max = 1e12, radix?: number) =>
	parseInt(`${Math.random() * (max - min) + min}`, radix)
