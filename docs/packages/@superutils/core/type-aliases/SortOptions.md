# Type Alias: SortOptions

> **SortOptions** = `object`

Defined in: [packages/core/src/iterable/types.ts:19](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/iterable/types.ts#L19)

Configuration for sorting iterables

## Properties

### ignoreCase?

> `optional` **ignoreCase**: `boolean`

Defined in: [packages/core/src/iterable/types.ts:20](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/iterable/types.ts#L20)

***

### newInstance?

> `optional` **newInstance**: `boolean`

Defined in: [packages/core/src/iterable/types.ts:26](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/iterable/types.ts#L26)

Whether to create a new instance of preserve original reference

Default: `true` for Array, `false` for Map.

***

### reverse?

> `optional` **reverse**: `boolean`

Defined in: [packages/core/src/iterable/types.ts:28](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/iterable/types.ts#L28)

Reverse sorted result

***

### undefinedFirst?

> `optional` **undefinedFirst**: `boolean`

Defined in: [packages/core/src/iterable/types.ts:34](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/iterable/types.ts#L34)

Whether to place undefined/null values at the beginning of the sorted array.

Default: `false`
