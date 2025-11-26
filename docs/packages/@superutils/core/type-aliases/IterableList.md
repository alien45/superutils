# Type Alias: IterableList\<K, V\>

> **IterableList**\<`K`, `V`\> = `object` & \{ `size`: `number`; \} \| \{ `length`: `number`; \}

Defined in: packages/core/src/iterable/types.ts:2

A general type helper to capture all iterables like Array, Map, Set....

## Type Declaration

### entries()

> **entries**: () => `IterableIterator`\<\[`K`, `V`\]\>

#### Returns

`IterableIterator`\<\[`K`, `V`\]\>

### hasOwnProperty()

> **hasOwnProperty**: (`name`) => `boolean`

#### Parameters

##### name

`string`

#### Returns

`boolean`

### keys()

> **keys**: () => `IterableIterator`\<`K`\>

#### Returns

`IterableIterator`\<`K`\>

### values()

> **values**: () => `IterableIterator`\<`V`\>

#### Returns

`IterableIterator`\<`V`\>

## Type Parameters

### K

`K` = `unknown`

### V

`V` = `unknown`
