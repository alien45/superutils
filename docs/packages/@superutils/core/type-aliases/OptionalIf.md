# Type Alias: OptionalIf\<T1, T2, T2IF, T1Alt\>

> **OptionalIf**\<`T1`, `T2`, `T2IF`, `T1Alt`\> = `T2` *extends* `T2IF` ? `T1` : `T1` \| `T1Alt`

Defined in: [types.ts:188](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/core/src/types.ts#L188)

Make T1 optional if T2 is undefined

## Type Parameters

### T1

`T1`

### T2

`T2`

### T2IF

`T2IF` = `undefined`

### T1Alt

`T1Alt` = `undefined`
