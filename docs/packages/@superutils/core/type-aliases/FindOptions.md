# Type Alias: FindOptions\<K, V, IncludeKey\>

> **FindOptions**\<`K`, `V`, `IncludeKey`\> = `Omit`\<[`SearchOptions`](SearchOptions.md)\<`K`, `V`\>, `"limit"` \| `"asMap"`\> & `object`

Defined in: [packages/core/src/map/mapFind.ts:5](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/map/mapFind.ts#L5)

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
