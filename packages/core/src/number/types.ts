/**
 * Describes a valid finite number type.
 */
export type FiniteNumber<N> = N extends number
	? number extends N
		? never // excludes Infinity & NaN
		: N
	: never

/**
 * Describes an integer type.
 */
export type Integer<N> = N extends number
	? number extends N
		? never // excludes Infinity & NaN
		: `${N}` extends
					| `${string}.${string}`
					| `.${string}`
					| `${string}e-${string}`
			? never
			: N
	: never

/**
 * Describes a number type with negative integer values.
 */
export type NegativeInteger<N> = N extends number
	? `${N}` extends `-${string}`
		? `${N}` extends `-${string}.${string}` | `-${string}e-${string}`
			? never // exclude decimal numbers
			: N
		: never
	: never

/**
 * Describes a number type with negative values.
 */
export type NegativeNumber<N> = N extends number
	? `${N}` extends `-${string}`
		? N
		: never
	: never

/**
 * Describes a number type with positive integer values.
 */
export type PositiveInteger<N> = N extends number
	? number extends N
		? never // excludes Infinity & NaN
		: `${N}` extends
					| `-${string}`
					| '0'
					| `${string}.${string}`
					| `${string}e-${string}`
			? never
			: N
	: never

/**
 * Describes a number type with positive values.
 */
export type PositiveNumber<N> = N extends number
	? number extends N
		? never // excludes Infinity & NaN
		: `${N}` extends `-${string}` | '0'
			? never
			: N
	: never
