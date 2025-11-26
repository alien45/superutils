# Type Alias: SortOptions

> **SortOptions** = `object`

Defined in: packages/core/src/iterable/types.ts:19

Configuration for sorting iterables

## Properties

### ignoreCase?

> `optional` **ignoreCase**: `boolean`

Defined in: packages/core/src/iterable/types.ts:20

***

### newInstance?

> `optional` **newInstance**: `boolean`

Defined in: packages/core/src/iterable/types.ts:26

Whether to create a new instance of preserve original reference

Default: `true` for Array, `false` for Map.

***

### reverse?

> `optional` **reverse**: `boolean`

Defined in: packages/core/src/iterable/types.ts:28

Reverse sorted result

***

### undefinedFirst?

> `optional` **undefinedFirst**: `boolean`

Defined in: packages/core/src/iterable/types.ts:34

Whether to place undefined/null values at the beginning of the sorted array.

Default: `false`
