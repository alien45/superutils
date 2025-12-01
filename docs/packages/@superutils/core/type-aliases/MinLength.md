# Type Alias: MinLength\<T, Count\>

> **MinLength**\<`T`, `Count`\> = `T` *extends* \[infer F, `...(infer R)`\] ? `undefined` *extends* `F` ? `MinLength`\<`R`, `Count`\> : `MinLength`\<`R`, \[`...Count`, `unknown`\]\> : `Count`\[`"length"`\]

Defined in: [packages/core/src/types.ts:179](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/types.ts#L179)

## Type Parameters

### T

`T` *extends* `unknown`[]

### Count

`Count` *extends* `unknown`[] = \[\]
