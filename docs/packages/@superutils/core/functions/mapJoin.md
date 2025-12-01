# Function: mapJoin()

> **mapJoin**\<`K`, `V`\>(...`inputs`): `Map`\<`K`, `V`\>

Defined in: [packages/core/src/map/mapJoin.ts:34](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/map/mapJoin.ts#L34)

Creates a new Map by combining two or more Maps

## Type Parameters

### K

`K`

### V

`V`

## Parameters

### inputs

...(`Map`\<`K`, `V`\> \| \[`K`, `V`\][])[]

A rest parameter of Maps and/or Map-entry (key-value pair tuples) Array.

## Returns

`Map`\<`K`, `V`\>

new combined Map

## Examples

```typescript
import { mapJoin } from '@superutils/core'

const maps = [
	new Map([['a', 1]]),
	new Map([['b', 2]]),
]
const joined = mapJoin(...maps)
// Result: Map(2) {'a' => 1, 'b' => 2}
```

```typescript
import { mapJoin } from '@superutils/core'

const joined = mapJoin(
	new Map([['a', 1]]),
	[['b', 2]],
	new Map([['c', 3]]),
)
// Result: Map(2) {'a' => 1, 'b' => 2, 'c' => 3}
```
