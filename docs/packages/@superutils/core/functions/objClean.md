# Function: objClean()

> **objClean**\<`T`, `Key`\>(`obj`, `keys`, `ignoreIfNotExist`): `Record`\<`Key`, `T`\[`Key`\]\>

Defined in: [packages/core/src/obj/objClean.ts:11](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/obj/objClean.ts#L11)

Constructs a new object with only the supplied property names (keys) and their respective values

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
