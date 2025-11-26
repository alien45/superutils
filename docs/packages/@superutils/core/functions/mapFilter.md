# Function: mapFilter()

> **mapFilter**\<`V`, `K`\>(`map`, `callback`, `limit`, `result`): `Map`\<`K`, `V`\>

Defined in: [packages/core/src/map/mapFilter.ts:30](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/map/mapFilter.ts#L30)

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

## Name

mapFilter

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
