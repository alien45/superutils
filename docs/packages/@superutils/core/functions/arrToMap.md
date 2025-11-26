# Function: arrToMap()

> **arrToMap**\<`T`, `GetKeyFn`, `FlatDepth`, `MapItem`, `ParamKey`, `MapKey`\>(`arr`, `flatDepth`, `key?`): `Map`\<`MapKey`, `MapItem`\>

Defined in: [packages/core/src/arr/arrToMap.ts:33](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/arr/arrToMap.ts#L33)

Generate a Map from one or more arrays

## Type Parameters

### T

`T` *extends* `unknown`[]

### GetKeyFn

`GetKeyFn` *extends* (`item`, `index`, `flatArr`, `arr`) => `unknown`

### FlatDepth

`FlatDepth` *extends* `number` = `0`

### MapItem

`MapItem` = `FlatArray`\<`T`, `FlatDepth`\>

### ParamKey

`ParamKey` = `undefined` \| `GetKeyFn` \| `MapItem` *extends* `Record`\<`K`, `unknown`\> ? `MapItem`\<`MapItem`\>\[`K`\] : `unknown`

### MapKey

`MapKey` = `ParamKey` *extends* `undefined` ? `number` : `ParamKey` *extends* (...`args`) => `Ret` ? `Ret` : `ParamKey`

## Parameters

### arr

`T`

### flatDepth

`FlatDepth` = `...`

(optional) maximum recursion depth to flatten the array. Default: `0`

### key?

`ParamKey`

(optional) Array object-item property name or a function to generate keys for each array items.

## Returns

`Map`\<`MapKey`, `MapItem`\>

Converted Map

## Example

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
