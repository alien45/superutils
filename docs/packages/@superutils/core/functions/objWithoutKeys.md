# Function: objWithoutKeys()

> **objWithoutKeys**(`input`, `keys`, `output?`): `Record`\<`PropertyKey`, `unknown`\>

Defined in: [packages/core/src/obj/objWithoutKeys.ts:14](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/obj/objWithoutKeys.ts#L14)

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
