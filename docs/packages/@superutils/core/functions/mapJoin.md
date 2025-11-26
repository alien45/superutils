# Function: mapJoin()

> **mapJoin**\<`K`, `V`\>(...`inputs`): `Map`\<`K`, `V`\>

Defined in: [packages/core/src/map/mapJoin.ts:27](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/map/mapJoin.ts#L27)

## Type Parameters

### K

`K`

### V

`V`

## Parameters

### inputs

`Map`\<`K`, `V`\>[] | \[`K`, `V`\][][]

## Returns

`Map`\<`K`, `V`\>

## Name

mapJoin

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
