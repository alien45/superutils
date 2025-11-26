# Function: arrReadOnly()

> **arrReadOnly**\<`T`\>(`input`, `config`): `T`[]

Defined in: [packages/core/src/arr/arrReadOnly.ts:14](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/arr/arrReadOnly.ts#L14)

Sugar for `objReadOnly()` for an Array

## Type Parameters

### T

`T`

## Parameters

### input

`T`[]

### config

`Omit`\<[`ReadOnlyConfig`](../type-aliases/ReadOnlyConfig.md)\<`T`[]\>, `"revoke"`\> = `{}`

(optional)

## Returns

`T`[]

Readonly Array or object containing readonly Array and revoke function
