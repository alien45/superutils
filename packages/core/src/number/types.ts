/** Describes a number type with negative values only */
export type NegativeNumber<N extends number = number> =
	`${N}` extends `-${string}` ? N : never

/** Describes a number type with positive values excluding `0`  */
export type PositiveNumber<N extends number = number> = `${N}` extends
	| `-${string}`
	| '0'
	? never
	: N

/** Describes a number type with positive values and `0`  */
export type PositiveNumberWithZero<N extends number = number> =
	`${N}` extends `-${string}` ? never : N
