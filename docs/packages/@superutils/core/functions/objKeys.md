# Function: objKeys()

> **objKeys**\<`Key`, `Include`\>(`obj`, `sorted`, `includeSymbols`): `Include` *extends* `true` ? `Key`[] : `Key`[] & `string`[]

Defined in: [packages/core/src/obj/objKeys.ts:10](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/obj/objKeys.ts#L10)

Get object property names/keys

## Type Parameters

### Key

`Key` *extends* `PropertyKey`

### Include

`Include` *extends* `boolean` = `true`

## Parameters

### obj

`Record`\<`Key`, `unknown`\>

target object

### sorted

`boolean` = `true`

(optional) Whether to sort the keys. Default: `true`

### includeSymbols

`Include` = `...`

(optional) Whether to include `Symbol` object. Default: `false`

## Returns

`Include` *extends* `true` ? `Key`[] : `Key`[] & `string`[]
