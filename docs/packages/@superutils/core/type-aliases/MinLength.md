# Type Alias: MinLength\<T, Count\>

> **MinLength**\<`T`, `Count`\> = `T` *extends* \[infer F, `...(infer R)`\] ? `undefined` *extends* `F` ? `MinLength`\<`R`, `Count`\> : `MinLength`\<`R`, \[`...Count`, `unknown`\]\> : `Count`\[`"length"`\]

Defined in: [packages/core/src/types.ts:179](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/types.ts#L179)

## Type Parameters

### T

`T` *extends* `unknown`[]

### Count

`Count` *extends* `unknown`[] = \[\]
