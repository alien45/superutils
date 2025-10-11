# Type Alias: MinLength\<T, Count\>

> **MinLength**\<`T`, `Count`\> = `T` *extends* \[infer F, `...(infer R)`\] ? `undefined` *extends* `F` ? `MinLength`\<`R`, `Count`\> : `MinLength`\<`R`, \[`...Count`, `any`\]\> : `Count`\[`"length"`\]

Defined in: [types.ts:178](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/core/src/types.ts#L178)

## Type Parameters

### T

`T` *extends* `any`[]

### Count

`Count` *extends* `any`[] = \[\]
