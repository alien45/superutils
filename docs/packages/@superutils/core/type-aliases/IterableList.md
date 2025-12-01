# Type Alias: IterableList\<K, V\>

> **IterableList**\<`K`, `V`\> = `object` & \{ `clear`: () => `void`; `size`: `number`; \} \| \{ `length`: `number`; \}

Defined in: [packages/core/src/iterable/types.ts:17](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/iterable/types.ts#L17)

A general type to capture all iterables like Array, Map, Set....

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
