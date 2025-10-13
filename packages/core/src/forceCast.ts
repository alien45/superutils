/** Cast a value as `any` type to bypass type check. Use with caution. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
export const asAny = <T = any>(x: unknown) => x as T

/** Force cast one type into another to bypass type checks. Use with caution. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const forceCast = <T>(x: unknown) => x as any as T

export default forceCast
