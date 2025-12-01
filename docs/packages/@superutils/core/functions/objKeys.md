# Function: objKeys()

> **objKeys**\<`T`, `Include`\>(`obj`, `sorted`, `includeSymbols`): `Include` *extends* `true` ? keyof `T`[] : keyof `T`[] & `string`[]

Defined in: [packages/core/src/obj/objKeys.ts:10](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/obj/objKeys.ts#L10)

Get object property names/keys

## Type Parameters

### T

`T` *extends* `object`

### Include

`Include` *extends* `boolean` = `true`

## Parameters

### obj

`T`

target object

### sorted

`boolean` = `true`

(optional) Whether to sort the keys. Default: `true`

### includeSymbols

`Include` = `...`

(optional) Whether to include `Symbol` object. Default: `false`

## Returns

`Include` *extends* `true` ? keyof `T`[] : keyof `T`[] & `string`[]
