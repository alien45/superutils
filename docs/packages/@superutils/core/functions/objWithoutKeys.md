# Function: objWithoutKeys()

> **objWithoutKeys**(`input`, `keys`, `output?`): `object`

Defined in: [packages/core/src/obj/objWithoutKeys.ts:14](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/obj/objWithoutKeys.ts#L14)

objWithoutKeys

## Parameters

### input

`unknown`

### keys

`string`[]

property names to exclude

### output?

`Record`\<`PropertyKey`, `unknown`\>

(optional) to delete unwanted props from the original `input` use it here.
								Default: a copy of the `input` object

## Returns

`object`
