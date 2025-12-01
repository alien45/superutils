# Function: reverse()

> **reverse**\<`K`, `V`, `T`\>(`data`, `reverse`, `newInstance`): `V`[] \| \[`K`, `V`\][] \| `Map`\<`K`, `V`\> \| `Set`\<`V`\> \| `T` & `Record`\<`"clear"`, `unknown`\>

Defined in: [packages/core/src/iterable/reverse.ts:13](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/iterable/reverse.ts#L13)

Reverse a [IterableList](../type-aliases/IterableList.md) (Array/Map/Set) conditionally

## Type Parameters

### K

`K`

### V

`V`

### T

`T` *extends* [`IterableList`](../type-aliases/IterableList.md)\<`K`, `V`\>

## Parameters

### data

`T`

### reverse

`boolean` = `true`

(optional) condition to reverse the list. Default: `true`

### newInstance

`boolean` = `false`

(optional) whether to return a new instance of the list. Default: `false`

## Returns

`V`[] \| \[`K`, `V`\][] \| `Map`\<`K`, `V`\> \| `Set`\<`V`\> \| `T` & `Record`\<`"clear"`, `unknown`\>

reversed data in original type or empty array for unsupported type
