# Function: arrToMap()

## Call Signature

> **arrToMap**\<`T`, `FlatDepth`\>(`arr`, `flatDepth?`): `Map`\<`number`, `FlatArray`\<`T`, `FlatDepth`\>\>

Defined in: [packages/core/src/arr/arrToMap.ts:35](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/arr/arrToMap.ts#L35)

Generate a Map from one or more arrays

### Type Parameters

#### T

`T` *extends* `unknown`[]

#### FlatDepth

`FlatDepth` *extends* `number` = `0`

### Parameters

#### arr

`T`

#### flatDepth?

`FlatDepth`

(optional) maximum recursion depth to flatten the array. Default: `0`

### Returns

`Map`\<`number`, `FlatArray`\<`T`, `FlatDepth`\>\>

Converted Map

### Example

```typescript
type Item = { a: number }
const arr: Item[] = [{ a: 1 }, { a: 2 }, { a: 3 }, [{ a: 4 }]]
const map: Map<number, Item> = arrToMap(
	   arr,
	   (_: Item, i: number) => item.a,
)

@example Flatten and convert Array to Map
```typescript
type Item = { key: number; value: string }
const arr: (Item | Item[])[] = [
	{ key: 1, value: 'a' },
	{ key: 2, value: 'b' },
	{ key: 3, value: 'c' },
	[{ key: 4, value: 'd' }],
]
const map = arrToMap(arr, (item: Item) => item.key, 1) // Map<number, Item>
```

## Call Signature

> **arrToMap**\<`T`, `FlatDepth`, `MapItem`, `MapKey`\>(`arr`, `key`, `flatDepth?`): `Map`\<`MapKey`, `MapItem`\>

Defined in: [packages/core/src/arr/arrToMap.ts:41](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/arr/arrToMap.ts#L41)

Generate a Map from one or more arrays

### Type Parameters

#### T

`T` *extends* `unknown`[]

#### FlatDepth

`FlatDepth` *extends* `number` = `0`

#### MapItem

`MapItem` = `FlatArray`\<`T`, `FlatDepth`\>

#### MapKey

`MapKey` = `unknown`

### Parameters

#### arr

`T`

#### key

(`item`, `index`, `flatArr`) => `MapKey`

(optional) Array object-item property name or a function to generate keys for each array items.

#### flatDepth?

`FlatDepth`

(optional) maximum recursion depth to flatten the array. Default: `0`

### Returns

`Map`\<`MapKey`, `MapItem`\>

Converted Map

### Example

```typescript
type Item = { a: number }
const arr: Item[] = [{ a: 1 }, { a: 2 }, { a: 3 }, [{ a: 4 }]]
const map: Map<number, Item> = arrToMap(
	   arr,
	   (_: Item, i: number) => item.a,
)

@example Flatten and convert Array to Map
```typescript
type Item = { key: number; value: string }
const arr: (Item | Item[])[] = [
	{ key: 1, value: 'a' },
	{ key: 2, value: 'b' },
	{ key: 3, value: 'c' },
	[{ key: 4, value: 'd' }],
]
const map = arrToMap(arr, (item: Item) => item.key, 1) // Map<number, Item>
```

## Call Signature

> **arrToMap**\<`T`, `FlatDepth`, `MapItem`, `KeyProp`\>(`arr`, `key`, `flatDepth?`): `Map`\<`MapItem`\[`KeyProp`\], `MapItem`\>

Defined in: [packages/core/src/arr/arrToMap.ts:53](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/arr/arrToMap.ts#L53)

Generate a Map from one or more arrays

### Type Parameters

#### T

`T` *extends* `unknown`[]

#### FlatDepth

`FlatDepth` *extends* `number` = `0`

#### MapItem

`MapItem` = `FlatArray`\<`T`, `FlatDepth`\>

#### KeyProp

`KeyProp` *extends* `string` \| `number` \| `symbol` = keyof `MapItem`

### Parameters

#### arr

`T`

#### key

`KeyProp`

(optional) Array object-item property name or a function to generate keys for each array items.

#### flatDepth?

`FlatDepth`

(optional) maximum recursion depth to flatten the array. Default: `0`

### Returns

`Map`\<`MapItem`\[`KeyProp`\], `MapItem`\>

Converted Map

### Example

```typescript
type Item = { a: number }
const arr: Item[] = [{ a: 1 }, { a: 2 }, { a: 3 }, [{ a: 4 }]]
const map: Map<number, Item> = arrToMap(
	   arr,
	   (_: Item, i: number) => item.a,
)

@example Flatten and convert Array to Map
```typescript
type Item = { key: number; value: string }
const arr: (Item | Item[])[] = [
	{ key: 1, value: 'a' },
	{ key: 2, value: 'b' },
	{ key: 3, value: 'c' },
	[{ key: 4, value: 'd' }],
]
const map = arrToMap(arr, (item: Item) => item.key, 1) // Map<number, Item>
```
