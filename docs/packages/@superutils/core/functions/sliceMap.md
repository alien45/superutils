# Function: sliceMap()

> **sliceMap**\<`Data`, `Key`, `Value`, `AsMap`\>(`data`, `options?`): `AsMap` *extends* `false` ? `Value`[] : `Map`\<`Key`, `Value`\>

Defined in: [packages/core/src/iterable/sliceMap.ts:40](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/iterable/sliceMap.ts#L40)

Slice an iterable list and map the values into an Array/Map

## Type Parameters

### Data

`Data` *extends* [`IterableList`](../type-aliases/IterableList.md)

### Key

`Key` = `Data` *extends* [`IterableList`](../type-aliases/IterableList.md)\<`Key`, `unknown`\> ? `Key` : `never`

### Value

`Value` = `Data` *extends* [`IterableList`](../type-aliases/IterableList.md)\<`unknown`, `Value`\> ? `Value` : `never`

### AsMap

`AsMap` *extends* `boolean` = `false`

## Parameters

### data

`Data`

Array, Map, Set...

### options?

[`SliceMapOptions`](../type-aliases/SliceMapOptions.md)\<`Data`, `Value`, `Key`, `AsMap`\> | [`SliceMapCallback`](../type-aliases/SliceMapCallback.md)\<`Data`, `Value`, `Key`\>

## Returns

`AsMap` *extends* `false` ? `Value`[] : `Map`\<`Key`, `Value`\>

Array/Map
