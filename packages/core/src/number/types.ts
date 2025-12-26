/** Describes a number type with negative values only */
export type NegativeNumber<N> = N extends number
	? `${N}` extends `-${string}`
		? N
		: never
	: never

/** Describes a number type with positive values excluding `0`  */
export type PositiveNumber<N> = N extends number
	? `${N}` extends `-${string}` | '0'
		? never
		: N
	: never

/** Describes a number type with positive values and `0`  */
export type PositiveNumberWithZero<N> = N extends number
	? `${N}` extends `-${string}`
		? never
		: N
	: never
