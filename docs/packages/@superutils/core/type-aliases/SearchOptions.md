# Type Alias: SearchOptions\<K, V, AsMap\>

> **SearchOptions**\<`K`, `V`, `AsMap`\> = `object`

Defined in: packages/core/src/iterable/types.ts:38

Search criteria for searcheing iterables

## Type Parameters

### K

`K`

### V

`V`

### AsMap

`AsMap` *extends* `boolean` = `false`

## Properties

### asMap?

> `optional` **asMap**: `AsMap`

Defined in: packages/core/src/iterable/types.ts:40

Whethere to return the result as a map (`true`) or array (`false`). Default: `true`

***

### ignoreCase?

> `optional` **ignoreCase**: `boolean`

Defined in: packages/core/src/iterable/types.ts:53

case-insensitive search for strings. Default: `false`

***

### limit?

> `optional` **limit**: `number`

Defined in: packages/core/src/iterable/types.ts:55

limit number of results. Default: `Infinity`

***

### matchAll?

> `optional` **matchAll**: `boolean`

Defined in: packages/core/src/iterable/types.ts:59

match all supplied key-value pairs. Default: `false`

***

### matchExact?

> `optional` **matchExact**: `boolean`

Defined in: packages/core/src/iterable/types.ts:57

partial match for values. Default: `false`

***

### propToStr?

> `optional` **propToStr**: `boolean` \| \<`Item`\>(`item`, `value?`, `key?`) => `string`

Defined in: packages/core/src/iterable/types.ts:42

Whether to convert item property (object, map, array....) to string

***

### query

> **query**: `Record`\<`string`, `unknown`\> \| `string`

Defined in: packages/core/src/iterable/types.ts:61

key-value pairs

***

### result?

> `optional` **result**: `Map`\<`K`, `V`\>

Defined in: packages/core/src/iterable/types.ts:63

Map to store results in. Default: `new Map()`
