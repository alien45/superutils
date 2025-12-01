# Function: objReadOnly()

> **objReadOnly**\<`T`, `Revocable`, `Result`\>(`obj`, `config?`): `Result`

Defined in: [packages/core/src/obj/objReadOnly.ts:17](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/obj/objReadOnly.ts#L17)

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
