# Type Alias: MinLength\<T, Count\>

> **MinLength**\<`T`, `Count`\> = `T` *extends* \[infer F, `...(infer R)`\] ? `undefined` *extends* `F` ? `MinLength`\<`R`, `Count`\> : `MinLength`\<`R`, \[`...Count`, `unknown`\]\> : `Count`\[`"length"`\]

Defined in: [types.ts:179](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/core/src/types.ts#L179)

## Type Parameters

### T

`T` *extends* `unknown`[]

### Count

`Count` *extends* `unknown`[] = \[\]
