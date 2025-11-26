# Function: objReadOnly()

> **objReadOnly**\<`T`, `Revocable`, `Result`\>(`obj`, `config?`): `Result`

Defined in: [packages/core/src/obj/objReadOnly.ts:18](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/obj/objReadOnly.ts#L18)

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

## Name

objReadOnly
