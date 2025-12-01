# Function: objWithoutKeys()

> **objWithoutKeys**(`input`, `keys`, `output?`): `Record`\<`PropertyKey`, `unknown`\>

Defined in: [packages/core/src/obj/objWithoutKeys.ts:14](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/obj/objWithoutKeys.ts#L14)

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

`Record`\<`PropertyKey`, `unknown`\>
