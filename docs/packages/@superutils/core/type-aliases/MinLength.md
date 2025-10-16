# Type Alias: MinLength\<T, Count\>

> **MinLength**\<`T`, `Count`\> = `T` *extends* \[infer F, `...(infer R)`\] ? `undefined` *extends* `F` ? `MinLength`\<`R`, `Count`\> : `MinLength`\<`R`, \[`...Count`, `unknown`\]\> : `Count`\[`"length"`\]

Defined in: [types.ts:179](https://github.com/alien45/utiils/blob/1eb281bb287b81b48f87f780196f814d5c255c8a/packages/core/src/types.ts#L179)

## Type Parameters

### T

`T` *extends* `unknown`[]

### Count

`Count` *extends* `unknown`[] = \[\]
