# Function: objCopy()

> **objCopy**\<`Key`, `T`, `IgnoredKey`\>(`input`, `output?`, `ignoreKeys?`, `override?`, `recursive?`): `Record`\<`PropertyKey`, `unknown`\>

Defined in: [packages/core/src/obj/objCopy.ts:33](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/obj/objCopy.ts#L33)

## Type Parameters

### Key

`Key` *extends* `string` \| `symbol`

### T

`T` *extends* `Record`\<`Key`, `unknown`\>

### IgnoredKey

`IgnoredKey` *extends* `string` \| `symbol`

## Parameters

### input

`T`

input object

### output?

`Record`\<`PropertyKey`, `unknown`\>

(optional) output object

### ignoreKeys?

(optional) input peroperties to be ignored. Prevents output's property to be overriden.

For child object properties use "." (dot) separated path.

Eg: `"child.grandchild1"` where input is `{ child: { grandchild1: 1, grandchild2: 2 }}`

`Set`\<`IgnoredKey`\> | `IgnoredKey`[]

### override?

(optional) whether to allow override output (if provided) properties.
Accepted values:
`true`: input property will override output property
`false`: no overriding if output contains the property. Even if the property value is `undefined`.
`"empty"`: only allow overriding output property if it's value is empty by using [isEmpty](isEmpty.md).

Default: `false`

`boolean` | `"empty"`

### recursive?

`boolean` = `true`

## Returns

`Record`\<`PropertyKey`, `unknown`\>

copied and/or merged object

## Name

objCopy
