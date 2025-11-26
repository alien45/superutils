# Function: arrSort()

## Call Signature

> **arrSort**\<`V`\>(`arr`, `key`, `options?`): `V`[]

Defined in: [packages/core/src/arr/arrSort.ts:46](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/arr/arrSort.ts#L46)

Create a new map sorted by value-key

### Type Parameters

#### V

`V` *extends* `Record`\<`PropertyKey`, `unknown`\>

### Parameters

#### arr

`V`[]

#### key

keyof `V` & `string`

key of the object-value to sort by, or a comparator function

#### options?

[`SortOptions`](../type-aliases/SortOptions.md)

(optional) sorting options

### Returns

`V`[]

sorted map

### Examples

```typescript
import { arrSort } from '@superutils/core'
const map = new Map([
	   [1, 1],
	   [2, 2],
    [0, 0],
])
arrSort(map)
// result: Map(3) { 0 => 0, 1 => 1, 2 => 2 }
```

```typescript
import { arrSort } from '@superutils/core'
const map = new Map([
    [0, { name: 'Charlie' }],
    [1, { name: 'Alice' }],
    [2, { name: 'Bob' }],
])
arrSort(map, 'name')
// result: Map(3) {
//   1 => { name: 'Alice' },
//   2 => { name: 'Bob' },
//   0 => { name: 'Charlie' }
// }
```

## Call Signature

> **arrSort**\<`V`\>(`arr`, `comparator`, `options?`): `V`[]

Defined in: [packages/core/src/arr/arrSort.ts:51](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/arr/arrSort.ts#L51)

Create a new map sorted by value-key

### Type Parameters

#### V

`V`

### Parameters

#### arr

`V`[]

#### comparator

(`a`, `b`) => `number`

#### options?

[`SortOptions`](../type-aliases/SortOptions.md)

(optional) sorting options

### Returns

`V`[]

sorted map

### Examples

```typescript
import { arrSort } from '@superutils/core'
const map = new Map([
	   [1, 1],
	   [2, 2],
    [0, 0],
])
arrSort(map)
// result: Map(3) { 0 => 0, 1 => 1, 2 => 2 }
```

```typescript
import { arrSort } from '@superutils/core'
const map = new Map([
    [0, { name: 'Charlie' }],
    [1, { name: 'Alice' }],
    [2, { name: 'Bob' }],
])
arrSort(map, 'name')
// result: Map(3) {
//   1 => { name: 'Alice' },
//   2 => { name: 'Bob' },
//   0 => { name: 'Charlie' }
// }
```

## Call Signature

> **arrSort**\<`V`\>(`arr`, `options?`): `V`[]

Defined in: [packages/core/src/arr/arrSort.ts:56](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/arr/arrSort.ts#L56)

Create a new map sorted by value-key

### Type Parameters

#### V

`V` *extends* `string` \| `number` \| `boolean`

### Parameters

#### arr

`V`[]

#### options?

[`SortOptions`](../type-aliases/SortOptions.md)

(optional) sorting options

### Returns

`V`[]

sorted map

### Examples

```typescript
import { arrSort } from '@superutils/core'
const map = new Map([
	   [1, 1],
	   [2, 2],
    [0, 0],
])
arrSort(map)
// result: Map(3) { 0 => 0, 1 => 1, 2 => 2 }
```

```typescript
import { arrSort } from '@superutils/core'
const map = new Map([
    [0, { name: 'Charlie' }],
    [1, { name: 'Alice' }],
    [2, { name: 'Bob' }],
])
arrSort(map, 'name')
// result: Map(3) {
//   1 => { name: 'Alice' },
//   2 => { name: 'Bob' },
//   0 => { name: 'Charlie' }
// }
```
