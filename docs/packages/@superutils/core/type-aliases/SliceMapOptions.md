# Type Alias: SliceMapOptions\<Data, Value, Key, AsMap\>

> **SliceMapOptions**\<`Data`, `Value`, `Key`, `AsMap`\> = `object`

Defined in: [packages/core/src/iterable/sliceMap.ts:11](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/iterable/sliceMap.ts#L11)

## Type Parameters

### Data

`Data`

### Value

`Value`

### Key

`Key`

### AsMap

`AsMap` *extends* `boolean` = `false`

## Properties

### asMap?

> `optional` **asMap**: `AsMap`

Defined in: [packages/core/src/iterable/sliceMap.ts:13](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/iterable/sliceMap.ts#L13)

Whether to return the result as a Map (preserving original keys) or an Array

***

### end?

> `optional` **end**: `number`

Defined in: [packages/core/src/iterable/sliceMap.ts:17](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/iterable/sliceMap.ts#L17)

End index (exclusive). Default: `undefined` (end of the list)

***

### ignoreEmpty?

> `optional` **ignoreEmpty**: `boolean`

Defined in: [packages/core/src/iterable/sliceMap.ts:19](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/iterable/sliceMap.ts#L19)

Whether to exclude item if value is `undefined | null`

***

### start?

> `optional` **start**: `number`

Defined in: [packages/core/src/iterable/sliceMap.ts:21](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/iterable/sliceMap.ts#L21)

Start index. Default: `0`

***

### transform?

> `optional` **transform**: [`SliceMapCallback`](SliceMapCallback.md)\<`Data`, `Value`, `Key`\>

Defined in: [packages/core/src/iterable/sliceMap.ts:15](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/iterable/sliceMap.ts#L15)

callback to transform each item
