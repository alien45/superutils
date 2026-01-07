/** Check if value is an integer */
export const isInteger = (x: unknown): x is number => Number.isInteger(x)

/** Check if value is a valid negative integer */
export const isNegativeInteger = (x: unknown): x is number =>
	Number.isInteger(x) && (x as number) < 0

/** Check if value is a valid negative number */
export const isNegativeNumber = (x: unknown): x is number =>
	isNumber(x) && x < 0

/** Check if value is a valid finite number */
export const isNumber = (x: unknown): x is number =>
	typeof x === 'number' && !Number.isNaN(x) && Number.isFinite(x)

/** Check if value is a positive integer */
export const isPositiveInteger = (x: unknown): x is number =>
	isInteger(x) && x > 0

/** Check if value is a positive number */
export const isPositiveNumber = (x: unknown): x is number =>
	isNumber(x) && x > 0

export default isNumber
