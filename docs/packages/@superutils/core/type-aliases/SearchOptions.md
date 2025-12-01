# Type Alias: SearchOptions\<K, V, AsMap\>

> **SearchOptions**\<`K`, `V`, `AsMap`\> = `object`

Defined in: [packages/core/src/iterable/types.ts:44](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/iterable/types.ts#L44)

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

Defined in: [packages/core/src/iterable/types.ts:46](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/iterable/types.ts#L46)

Whethere to return the result as a map (`true`) or array (`false`). Default: `true`

***

### ignoreCase?

> `optional` **ignoreCase**: `boolean`

Defined in: [packages/core/src/iterable/types.ts:48](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/iterable/types.ts#L48)

case-insensitive search for strings. Default: `false`

***

### limit?

> `optional` **limit**: `number`

Defined in: [packages/core/src/iterable/types.ts:50](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/iterable/types.ts#L50)

limit number of results. Default: `Infinity`

***

### matchAll?

> `optional` **matchAll**: `boolean`

Defined in: [packages/core/src/iterable/types.ts:54](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/iterable/types.ts#L54)

match all supplied key-value pairs. Default: `false`

***

### matchExact?

> `optional` **matchExact**: `boolean`

Defined in: [packages/core/src/iterable/types.ts:52](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/iterable/types.ts#L52)

partial match for values. Default: `false`

***

### query

> **query**: `Record`\<`string`, `unknown`\> \| `string` \| `RegExp`

Defined in: [packages/core/src/iterable/types.ts:56](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/iterable/types.ts#L56)

key-value pairs

***

### result?

> `optional` **result**: `Map`\<`K`, `V`\>

Defined in: [packages/core/src/iterable/types.ts:58](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/iterable/types.ts#L58)

Map to store results in. Default: `new Map()`

***

### transform()?

> `optional` **transform**: (`item`, `value?`, `key?`) => `string` \| `undefined`

Defined in: [packages/core/src/iterable/types.ts:60](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/iterable/types.ts#L60)

Callback to convert item/item-property to string

#### Parameters

##### item

`V`

##### value?

`V`\[keyof `V`\]

##### key?

keyof `V`

#### Returns

`string` \| `undefined`
