# Function: sort()

## Call Signature

> **sort**\<`K`, `V`, `T`\>(`data`, `propertyName`, `options?`): [`IterableType`](../type-aliases/IterableType.md)\<`T`\>

Defined in: packages/core/src/iterable/sort.ts:57

Sort iterable lists (Array/Map/Set).

### Type Parameters

#### K

`K`

#### V

`V` *extends* `Record`\<`PropertyKey`, `unknown`\>

#### T

`T` *extends* [`IterableList`](../type-aliases/IterableList.md)\<`K`, `V`\>

### Parameters

#### data

`T`

#### propertyName

keyof `V` & `string`

#### options?

[`SortOptions`](../type-aliases/SortOptions.md)

(optional) extra sorting opitons

### Returns

[`IterableType`](../type-aliases/IterableType.md)\<`T`\>

sorted map

### Examples

```typescript
import { sort } from '@superutils/core'
const map = new Map([
	   [1, 1],
	   [2, 2],
    [0, 0],
])
sort(map)
// result: Map(3) { 0 => 0, 1 => 1, 2 => 2 }
```

```typescript
import { sort } from '@superutils/core'
const map = new Map([
    [0, { name: 'Charlie' }],
    [1, { name: 'Alice' }],
    [2, { name: 'Bob' }],
])
sort(map, 'name')
// result: Map(3) {
//   1 => { name: 'Alice' },
//   2 => { name: 'Bob' },
//   0 => { name: 'Charlie' }
// }
```

## Call Signature

> **sort**\<`K`, `V`\>(`data`, `byKey`, `options?`): `Map`\<`K`, `V`\>

Defined in: packages/core/src/iterable/sort.ts:66

Sort iterable lists (Array/Map/Set).

### Type Parameters

#### K

`K`

#### V

`V`

### Parameters

#### data

`Map`\<`K`, `V`\>

#### byKey

`true`

Sort by value property name

#### options?

[`SortOptions`](../type-aliases/SortOptions.md)

(optional) extra sorting opitons

### Returns

`Map`\<`K`, `V`\>

sorted map

### Examples

```typescript
import { sort } from '@superutils/core'
const map = new Map([
	   [1, 1],
	   [2, 2],
    [0, 0],
])
sort(map)
// result: Map(3) { 0 => 0, 1 => 1, 2 => 2 }
```

```typescript
import { sort } from '@superutils/core'
const map = new Map([
    [0, { name: 'Charlie' }],
    [1, { name: 'Alice' }],
    [2, { name: 'Bob' }],
])
sort(map, 'name')
// result: Map(3) {
//   1 => { name: 'Alice' },
//   2 => { name: 'Bob' },
//   0 => { name: 'Charlie' }
// }
```

## Call Signature

> **sort**\<`K`, `V`\>(`map`, `comparator`, `options?`): `Map`\<`K`, `V`\>

Defined in: packages/core/src/iterable/sort.ts:72

Sort iterable lists (Array/Map/Set).

### Type Parameters

#### K

`K`

#### V

`V`

### Parameters

#### map

`Map`\<`K`, `V`\>

#### comparator

[`EntryComparator`](../type-aliases/EntryComparator.md)\<`K`, `V`\>

#### options?

[`SortOptions`](../type-aliases/SortOptions.md)

(optional) extra sorting opitons

### Returns

`Map`\<`K`, `V`\>

sorted map

### Examples

```typescript
import { sort } from '@superutils/core'
const map = new Map([
	   [1, 1],
	   [2, 2],
    [0, 0],
])
sort(map)
// result: Map(3) { 0 => 0, 1 => 1, 2 => 2 }
```

```typescript
import { sort } from '@superutils/core'
const map = new Map([
    [0, { name: 'Charlie' }],
    [1, { name: 'Alice' }],
    [2, { name: 'Bob' }],
])
sort(map, 'name')
// result: Map(3) {
//   1 => { name: 'Alice' },
//   2 => { name: 'Bob' },
//   0 => { name: 'Charlie' }
// }
```

## Call Signature

> **sort**\<`V`, `T`\>(`arrOrSet`, `comparator`, `options?`): `T` *extends* `V`[] ? `V`[] : `Set`\<`V`\>

Defined in: packages/core/src/iterable/sort.ts:77

Sort iterable lists (Array/Map/Set).

### Type Parameters

#### V

`V`

#### T

`T` *extends* `V`[] \| `Set`\<`V`\>

### Parameters

#### arrOrSet

`T`

#### comparator

[`ArrayComparator`](../type-aliases/ArrayComparator.md)\<`V`\>

#### options?

[`SortOptions`](../type-aliases/SortOptions.md)

(optional) extra sorting opitons

### Returns

`T` *extends* `V`[] ? `V`[] : `Set`\<`V`\>

sorted map

### Examples

```typescript
import { sort } from '@superutils/core'
const map = new Map([
	   [1, 1],
	   [2, 2],
    [0, 0],
])
sort(map)
// result: Map(3) { 0 => 0, 1 => 1, 2 => 2 }
```

```typescript
import { sort } from '@superutils/core'
const map = new Map([
    [0, { name: 'Charlie' }],
    [1, { name: 'Alice' }],
    [2, { name: 'Bob' }],
])
sort(map, 'name')
// result: Map(3) {
//   1 => { name: 'Alice' },
//   2 => { name: 'Bob' },
//   0 => { name: 'Charlie' }
// }
```

## Call Signature

> **sort**\<`K`, `V`, `T`\>(`data`, `options?`): [`IterableType`](../type-aliases/IterableType.md)\<`T`\>

Defined in: packages/core/src/iterable/sort.ts:82

Sort iterable lists (Array/Map/Set).

### Type Parameters

#### K

`K`

#### V

`V` *extends* `string` \| `number` \| `boolean`

#### T

`T` *extends* [`IterableList`](../type-aliases/IterableList.md)\<`K`, `V`\>

### Parameters

#### data

`T`

#### options?

[`SortOptions`](../type-aliases/SortOptions.md)

(optional) extra sorting opitons

### Returns

[`IterableType`](../type-aliases/IterableType.md)\<`T`\>

sorted map

### Examples

```typescript
import { sort } from '@superutils/core'
const map = new Map([
	   [1, 1],
	   [2, 2],
    [0, 0],
])
sort(map)
// result: Map(3) { 0 => 0, 1 => 1, 2 => 2 }
```

```typescript
import { sort } from '@superutils/core'
const map = new Map([
    [0, { name: 'Charlie' }],
    [1, { name: 'Alice' }],
    [2, { name: 'Bob' }],
])
sort(map, 'name')
// result: Map(3) {
//   1 => { name: 'Alice' },
//   2 => { name: 'Bob' },
//   0 => { name: 'Charlie' }
// }
```
