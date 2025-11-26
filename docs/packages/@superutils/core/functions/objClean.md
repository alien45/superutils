# Function: objClean()

> **objClean**\<`T`, `Key`\>(`obj`, `keys`, `ignoreIfNotExist`): `Record`\<`Key`, `T`\[`Key`\]\>

Defined in: [packages/core/src/obj/objClean.ts:13](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/obj/objClean.ts#L13)

## Type Parameters

### T

`T` *extends* `Record`\<`PropertyKey`, `unknown`\>

### Key

`Key` *extends* `string` \| `number` \| `symbol` = keyof `T`

## Parameters

### obj

`T`

### keys

`Key`[]

property names to keep

### ignoreIfNotExist

`boolean` = `true`

(optional) if truthy, will ignore non-existent `keys`. Default: `true`

## Returns

`Record`\<`Key`, `T`\[`Key`\]\>

## Name

objClean
