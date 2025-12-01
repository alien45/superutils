# Function: find()

## Call Signature

> **find**\<`K`, `V`, `IncludeKey`, `Return`\>(`data`, `callback`): `Return`

Defined in: [packages/core/src/iterable/find.ts:40](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/iterable/find.ts#L40)

Finds a first item matching criteria in an [IterableList](../type-aliases/IterableList.md).

### Type Parameters

#### K

`K`

#### V

`V` *extends* `Record`\<`string`, `unknown`\>

#### IncludeKey

`IncludeKey` *extends* `boolean` = `false`

#### Return

`Return` = `undefined` \| `IncludeKey` *extends* `true` ? \[`K`, `V`\] : `V`

### Parameters

#### data

[`IterableList`](../type-aliases/IterableList.md)\<`K`, `V`\>

#### callback

(`value`, `key`, `data`) => `boolean`

### Returns

`Return`

first item matched or `undefined` if not found

### Examples

```typescript
import { find } from '@superutils/core'

const map = new Map<number, { name: string; age: number }>([
	[1, { name: 'Alice', age: 30 }],
	[2, { name: 'Bob', age: 25 }],
	[3, { name: 'Charlie', age: 35 }],
])
const result = mapFind(testMap, ({ name }) => name === 'Bob')
// result: { name: 'Bob', age: 25 }
```

```typescript
import { find } from '@superutils/core'

const map = new Map<number, { name: string; age: number }>([
	[1, { name: 'Alice', age: 30 }],
	[2, { name: 'Bob', age: 25 }],
	[3, { name: 'Charlie', age: 35 }],
])
	const result = mapFind(testmap, {
		query: 'Bob',
		key: 'name',
	})
// result: { name: 'Bob', age: 25 }
```

## Call Signature

> **find**\<`K`, `V`, `IncludeKey`, `Return`\>(`data`, `options`): `Return`

Defined in: [packages/core/src/iterable/find.ts:49](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/iterable/find.ts#L49)

Finds a first item matching criteria in an [IterableList](../type-aliases/IterableList.md).

### Type Parameters

#### K

`K`

#### V

`V` *extends* `Record`\<`string`, `unknown`\>

#### IncludeKey

`IncludeKey` *extends* `boolean` = `false`

#### Return

`Return` = `undefined` \| `IncludeKey` *extends* `true` ? \[`K`, `V`\] : `V`

### Parameters

#### data

[`IterableList`](../type-aliases/IterableList.md)\<`K`, `V`\>

#### options

[`FindOptions`](../type-aliases/FindOptions.md)\<`K`, `V`, `IncludeKey`\>

### Returns

`Return`

first item matched or `undefined` if not found

### Examples

```typescript
import { find } from '@superutils/core'

const map = new Map<number, { name: string; age: number }>([
	[1, { name: 'Alice', age: 30 }],
	[2, { name: 'Bob', age: 25 }],
	[3, { name: 'Charlie', age: 35 }],
])
const result = mapFind(testMap, ({ name }) => name === 'Bob')
// result: { name: 'Bob', age: 25 }
```

```typescript
import { find } from '@superutils/core'

const map = new Map<number, { name: string; age: number }>([
	[1, { name: 'Alice', age: 30 }],
	[2, { name: 'Bob', age: 25 }],
	[3, { name: 'Charlie', age: 35 }],
])
	const result = mapFind(testmap, {
		query: 'Bob',
		key: 'name',
	})
// result: { name: 'Bob', age: 25 }
```
