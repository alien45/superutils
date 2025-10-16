/**
 * @function	arrUnique
 * @summary		constructs a new array of unique values
 */
export const arrUnique = <T = unknown>(arr: T[], flatDepth = 0) =>
	Array.from(new Set(arr.flat(flatDepth)))

export default arrUnique
