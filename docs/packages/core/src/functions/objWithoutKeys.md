# Function: objWithoutKeys()

> **objWithoutKeys**(`input`, `keys`, `output?`): `Object`

Defined in: [packages/core/src/objWithoutKeys.ts:14](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/core/src/objWithoutKeys.ts#L14)

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

`Object`
