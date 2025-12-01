# Function: filter()

> **filter**\<`K`, `V`, `AsArray`, `Result`\>(`data`, `predicate`, `limit`, `asArray`, `result`): `Result`

Defined in: [packages/core/src/iterable/filter.ts:30](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/iterable/filter.ts#L30)

Filter [IterableList](../type-aliases/IterableList.md) (Array, Map, Set) items.

## Type Parameters

### K

`K`

### V

`V`

### AsArray

`AsArray` *extends* `boolean` = `false`

### Result

`Result` = `AsArray` *extends* `true` ? `V`[] : `Map`\<`K`, `V`\>

## Parameters

### data

[`IterableList`](../type-aliases/IterableList.md)\<`K`, `V`\>

### predicate

(`value`, `key`, `data`) => `boolean`

callback function to filter values

### limit

`number` = `Infinity`

### asArray

`AsArray` = `...`

### result

`Map`\<`K`, `V`\> = `...`

## Returns

`Result`

new Map with filtered items

## Example

```typescript
import { filter } from '@superutils/core'

const map = new Map<number, { name: string; age: number }>([
	[1, { name: 'Alice', age: 30 }],
	[2, { name: 'Bob', age: 25 }],
	[3, { name: 'Charlie', age: 35 }],
])

const filtered = filter(map, item => item.age >= 30)
// result: Map(2) {
//   1 => { name: 'Alice', age: 30 },
//   3 => { name: 'Charlie', age: 35 }
// }
```
