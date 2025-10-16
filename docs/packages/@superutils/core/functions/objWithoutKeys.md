# Function: objWithoutKeys()

> **objWithoutKeys**(`input`, `keys`, `output?`): `object`

Defined in: [objWithoutKeys.ts:14](https://github.com/alien45/utiils/blob/1eb281bb287b81b48f87f780196f814d5c255c8a/packages/core/src/objWithoutKeys.ts#L14)

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
