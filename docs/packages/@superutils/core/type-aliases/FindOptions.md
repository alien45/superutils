# Type Alias: FindOptions\<K, V, IncludeKey\>

> **FindOptions**\<`K`, `V`, `IncludeKey`\> = `Omit`\<[`SearchOptions`](SearchOptions.md)\<`K`, `V`\>, `"limit"` \| `"asMap"`\> & `object`

Defined in: [packages/core/src/iterable/types.ts:2](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/iterable/types.ts#L2)

Configuration for finding [IterableList](IterableList.md) items

## Type Declaration

### includeKey?

> `optional` **includeKey**: `IncludeKey`

Whether to include the key in the return type.

If `true`, return type is `[K, V]` else `V`

Default: `false`

## Type Parameters

### K

`K`

### V

`V`

### IncludeKey

`IncludeKey` *extends* `boolean` = `false`
