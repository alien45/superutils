/** Cast a value as `any` type to bypass type check. Use with caution. */
export const asAny = (x: unknown) => x as any

/** Force cast one type into another to bypass type checks. Use with caution. */
export const forceCast = <T>(x: unknown) => x as any as T

export default forceCast
