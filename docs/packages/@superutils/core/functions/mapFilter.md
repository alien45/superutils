# Function: mapFilter()

> **mapFilter**\<`V`, `K`\>(`map`, `callback`, `limit`, `result`): `Map`\<`K`, `V`\>

Defined in: [packages/core/src/map/mapFilter.ts:29](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/map/mapFilter.ts#L29)

Array.filter equivalent for Map.

## Type Parameters

### V

`V` = `unknown`

### K

`K` = `unknown`

## Parameters

### map

`Map`\<`K`, `V`\>

### callback

(`value`, `key`, `map`) => `boolean`

### limit

`number` = `map.size`

### result

`Map`\<`K`, `V`\> = `...`

## Returns

`Map`\<`K`, `V`\>

new Map with filtered items

## Example

```typescript
import { mapFilter } from '@superutils/core'

const map = new Map<number, { name: string; age: number }>([
	[1, { name: 'Alice', age: 30 }],
	[2, { name: 'Bob', age: 25 }],
	[3, { name: 'Charlie', age: 35 }],
])

const filtered = mapFilter(map, item => item.age >= 30)
// result: Map(2) {
//   1 => { name: 'Alice', age: 30 },
//   3 => { name: 'Charlie', age: 35 }
// }
```
