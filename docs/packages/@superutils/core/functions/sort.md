# Function: sort()

## Call Signature

> **sort**\<`K`, `V`, `T`\>(`data`, `propertyName`, `options?`): `T`

Defined in: [packages/core/src/iterable/sort.ts:57](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/iterable/sort.ts#L57)

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

Accepted values:
- `string`: value object property name
- `function`: comparator function. Recommended for performance.
- `true`: indicates to sort by Map keys instead of values.

#### options?

[`SortOptions`](../type-aliases/SortOptions.md)

(optional) extra sorting opitons

### Returns

`T`

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

Defined in: [packages/core/src/iterable/sort.ts:63](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/iterable/sort.ts#L63)

Sort `Map` by map-keys `K`

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

#### options?

[`SortOptions`](../type-aliases/SortOptions.md)

### Returns

`Map`\<`K`, `V`\>

## Call Signature

> **sort**\<`K`, `V`\>(`map`, `comparator`, `options?`): `Map`\<`K`, `V`\>

Defined in: [packages/core/src/iterable/sort.ts:69](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/iterable/sort.ts#L69)

Sort `Map` with comparator function

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

### Returns

`Map`\<`K`, `V`\>

## Call Signature

> **sort**\<`V`\>(`array`, `comparator`, `options?`): `V`[]

Defined in: [packages/core/src/iterable/sort.ts:75](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/iterable/sort.ts#L75)

Sort `Array` with comparator function

### Type Parameters

#### V

`V`

### Parameters

#### array

`V`[]

#### comparator

[`ArrayComparator`](../type-aliases/ArrayComparator.md)\<`V`\>

#### options?

[`SortOptions`](../type-aliases/SortOptions.md)

### Returns

`V`[]

## Call Signature

> **sort**\<`V`\>(`set`, `comparator`, `options?`): `Set`\<`V`\>

Defined in: [packages/core/src/iterable/sort.ts:81](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/iterable/sort.ts#L81)

Sort `Set` with comparator function

### Type Parameters

#### V

`V`

### Parameters

#### set

`Set`\<`V`\>

#### comparator

[`ArrayComparator`](../type-aliases/ArrayComparator.md)\<`V`\>

#### options?

[`SortOptions`](../type-aliases/SortOptions.md)

### Returns

`Set`\<`V`\>

## Call Signature

> **sort**\<`K`, `V`, `T`\>(`data`, `options?`): `T`

Defined in: [packages/core/src/iterable/sort.ts:87](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/iterable/sort.ts#L87)

Sort Array/Map/Set with `string | boolean | number` values

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

### Returns

`T`
