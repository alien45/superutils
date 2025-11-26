# Function: objWithoutKeys()

> **objWithoutKeys**(`input`, `keys`, `output?`): `object`

Defined in: [packages/core/src/obj/objWithoutKeys.ts:14](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/obj/objWithoutKeys.ts#L14)

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
