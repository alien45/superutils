# Function: objKeys()

> **objKeys**\<`T`, `Include`\>(`obj`, `sorted`, `includeSymbols`): `Include` *extends* `true` ? keyof `T`[] : keyof `T`[] & `string`[]

Defined in: [packages/core/src/obj/objKeys.ts:10](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/obj/objKeys.ts#L10)

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
