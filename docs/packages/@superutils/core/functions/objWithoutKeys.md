# Function: objWithoutKeys()

> **objWithoutKeys**(`input`, `keys`, `output?`): `object`

Defined in: [objWithoutKeys.ts:14](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/core/src/objWithoutKeys.ts#L14)

objWithoutKeys

## Parameters

### input

`unknown`

### keys

`string`[]

property names to exclude

### output?

`Record`\<`string` \| `number` \| `symbol`, `unknown`\>

(optional) to delete unwanted props from the original `input` use it here.
								Default: a copy of the `input` object

## Returns

`object`
