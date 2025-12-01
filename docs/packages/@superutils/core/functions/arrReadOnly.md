# Function: arrReadOnly()

> **arrReadOnly**\<`T`\>(`arr`, `config`): `T`[]

Defined in: [packages/core/src/arr/arrReadOnly.ts:14](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/arr/arrReadOnly.ts#L14)

Sugar for `objReadOnly()` for an Array

## Type Parameters

### T

`T`

## Parameters

### arr

`T`[]

### config

`Omit`\<[`ReadOnlyConfig`](../type-aliases/ReadOnlyConfig.md)\<`T`[]\>, `"revoke"`\> = `{}`

(optional)

## Returns

`T`[]

Readonly Array or object containing readonly Array and revoke function
