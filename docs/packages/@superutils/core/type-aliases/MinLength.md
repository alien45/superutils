# Type Alias: MinLength\<T, Count\>

> **MinLength**\<`T`, `Count`\> = `T` *extends* \[infer F, `...(infer R)`\] ? `undefined` *extends* `F` ? `MinLength`\<`R`, `Count`\> : `MinLength`\<`R`, \[`...Count`, `unknown`\]\> : `Count`\[`"length"`\]

Defined in: [types.ts:179](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/core/src/types.ts#L179)

## Type Parameters

### T

`T` *extends* `unknown`[]

### Count

`Count` *extends* `unknown`[] = \[\]
