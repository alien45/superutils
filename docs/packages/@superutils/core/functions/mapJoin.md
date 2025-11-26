# Function: mapJoin()

> **mapJoin**\<`K`, `V`\>(...`inputs`): `Map`\<`K`, `V`\>

Defined in: [packages/core/src/map/mapJoin.ts:26](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/map/mapJoin.ts#L26)

Creates a new Map by combining two or more Maps

## Type Parameters

### K

`K`

### V

`V`

## Parameters

### inputs

A rest parameter of Maps and/or array of entries (key-value pair tuples).

`Map`\<`K`, `V`\>[] | \[`K`, `V`\][][]

## Returns

`Map`\<`K`, `V`\>

new combined Map

## Example

```typescript
const maps = [
	new Map([['a', 1]]),
	new Map([['b', 2]]),
]
const joined = mapJoin(...maps) // Map(2) {'a' => 1, 'b' => 2}

// use 2D array
const maps = [
	[['a', 1]],
	[['b', 2]],
]
const joined = mapJoin(...maps) // Map(2) {'a' => 1, 'b' => 2}
```
