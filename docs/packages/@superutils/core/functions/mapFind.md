# Function: mapFind()

## Call Signature

> **mapFind**\<`K`, `V`, `IncludeKey`, `Return`\>(`data`, `callback`): `Return`

Defined in: [packages/core/src/map/mapFind.ts:52](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/map/mapFind.ts#L52)

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

`Map`\<`K`, `V`\>

#### callback

(`value`, `key`, `map`) => `boolean`

### Returns

`Return`

first item matched or `undefined` if not found

### Examples

```typescript
import { mapFindByKey } from '@superutils/core'

const map = new Map<number, { name: string; age: number }>([
	[1, { name: 'Alice', age: 30 }],
	[2, { name: 'Bob', age: 25 }],
	[3, { name: 'Charlie', age: 35 }],
])
const result = mapFind(testMap, ({ name }) => name === 'Bob')
// result: { name: 'Bob', age: 25 }
```

```typescript
import { mapFindByKey } from '@superutils/core'

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

> **mapFind**\<`K`, `V`, `IncludeKey`, `Return`\>(`data`, `options`): `Return`

Defined in: [packages/core/src/map/mapFind.ts:58](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/map/mapFind.ts#L58)

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

`Map`\<`K`, `V`\>

#### options

[`FindOptions`](../type-aliases/FindOptions.md)\<`K`, `V`, `IncludeKey`\>

### Returns

`Return`

first item matched or `undefined` if not found

### Examples

```typescript
import { mapFindByKey } from '@superutils/core'

const map = new Map<number, { name: string; age: number }>([
	[1, { name: 'Alice', age: 30 }],
	[2, { name: 'Bob', age: 25 }],
	[3, { name: 'Charlie', age: 35 }],
])
const result = mapFind(testMap, ({ name }) => name === 'Bob')
// result: { name: 'Bob', age: 25 }
```

```typescript
import { mapFindByKey } from '@superutils/core'

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
