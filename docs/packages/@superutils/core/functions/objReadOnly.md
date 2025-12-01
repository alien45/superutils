# Function: objReadOnly()

> **objReadOnly**\<`T`, `Revocable`, `Result`\>(`obj`, `config?`): `Result`

Defined in: [packages/core/src/obj/objReadOnly.ts:17](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/obj/objReadOnly.ts#L17)

Constructs a new read-only object where only new properties can be added.

Applies only to the top-level properties.

## Type Parameters

### T

`T` *extends* `object` \| `unknown`[]

### Revocable

`Revocable` *extends* `boolean` = `false`

### Result

`Result` = `Revocable` *extends* `true` ? `object` : `T`

## Parameters

### obj

`T`

input object

### config?

[`ReadOnlyConfig`](../type-aliases/ReadOnlyConfig.md)\<`T`, `Revocable`\>

(optional) extra configuration

## Returns

`Result`

Readonly object or object containing readonly object and revoke function
