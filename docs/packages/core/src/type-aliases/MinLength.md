# Type Alias: MinLength\<T, Count\>

> **MinLength**\<`T`, `Count`\> = `T` *extends* \[infer F, `...(infer R)`\] ? `undefined` *extends* `F` ? `MinLength`\<`R`, `Count`\> : `MinLength`\<`R`, \[`...Count`, `any`\]\> : `Count`\[`"length"`\]

Defined in: [packages/core/src/types.ts:168](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/core/src/types.ts#L168)

## Type Parameters

### T

`T` *extends* `any`[]

### Count

`Count` *extends* `any`[] = \[\]
