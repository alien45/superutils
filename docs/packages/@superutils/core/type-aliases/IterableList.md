# Type Alias: IterableList\<K, V\>

> **IterableList**\<`K`, `V`\> = `object` & \{ `size`: `number`; \} \| \{ `length`: `number`; \}

Defined in: [packages/core/src/iterable/types.ts:2](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/iterable/types.ts#L2)

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
