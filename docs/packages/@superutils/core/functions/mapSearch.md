# Function: mapSearch()

> **mapSearch**\<`K`, `V`, `AsMap`, `Result`\>(`data`, `options`): `Result`

Defined in: packages/core/src/iterable/search.ts:59

## Type Parameters

### K

`K`

### V

`V` *extends* `Record`\<`string`, `unknown`\>

### AsMap

`AsMap` *extends* `boolean` = `true`

### Result

`Result` = `AsMap` *extends* `true` ? `Map`\<`K`, `V`\> : `V`[]

## Parameters

### data

[`IterableList`](../type-aliases/IterableList.md)\<`K`, `V`\>

Map or Array of objects to search within

### options

[`SearchOptions`](../type-aliases/SearchOptions.md)\<`K`, `V`, `AsMap`\>

search criteria

## Returns

`Result`

new map with matched items

## Name

mapSearch
