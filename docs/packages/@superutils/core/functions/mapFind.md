# Function: mapFind()

## Call Signature

> **mapFind**\<`K`, `V`, `IncludeKey`, `Return`\>(`data`, `callback`): `Return`

Defined in: [packages/core/src/map/mapFind.ts:53](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/map/mapFind.ts#L53)

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

### Name

mapFind

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

Defined in: [packages/core/src/map/mapFind.ts:59](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/map/mapFind.ts#L59)

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

### Name

mapFind

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
