# Type Alias: OptionalIf\<T1, T2, T2IF, T1Alt\>

> **OptionalIf**\<`T1`, `T2`, `T2IF`, `T1Alt`\> = `T2` *extends* `T2IF` ? `T1` : `T1` \| `T1Alt`

Defined in: [packages/core/src/types.ts:189](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/types.ts#L189)

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
