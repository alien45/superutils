# Function: sliceMap()

> **sliceMap**\<`Key`, `Value`, `Data`, `AsMap`, `Result`\>(`data`, `first`, `last`, `callback?`, `ignoreUndefined?`, `asMap?`): `Result`

Defined in: [packages/core/src/iterable/sliceMap.ts:22](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/iterable/sliceMap.ts#L22)

Slice an iterable list (Array, Map, Set...) and map the values into an Array/Map

## Type Parameters

### Key

`Key`

### Value

`Value`

### Data

`Data` *extends* [`IterableList`](../type-aliases/IterableList.md)\<`Key`, `Value`\>

### AsMap

`AsMap` *extends* `boolean` = `false`

### Result

`Result` = `AsMap` *extends* `false` ? `Value`[] : `Map`\<`Key`, `Value`\>

## Parameters

### data

`Data`

### first

`number` = `0`

Default: `0`

### last

`number`

last index - inclusive. Default: index of the last item

### callback?

(`item`, `key`, `data`) => `Value`

to be executed on each item within the set range.

If callback throws error or returnes `undefined`, the item will be ignored.

Callback Params:
  - item: current item
  - key: index/key of the current item
  - data: original list

### ignoreUndefined?

`boolean` = `true`

Whether to exclude item if value is `undefined | null`

### asMap?

`AsMap` = `...`

## Returns

`Result`

Array of values
