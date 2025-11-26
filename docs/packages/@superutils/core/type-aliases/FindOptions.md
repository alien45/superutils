# Type Alias: FindOptions\<K, V, IncludeKey\>

> **FindOptions**\<`K`, `V`, `IncludeKey`\> = `Omit`\<[`SearchOptions`](SearchOptions.md)\<`K`, `V`\>, `"limit"` \| `"asMap"`\> & `object`

Defined in: [packages/core/src/map/mapFind.ts:5](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/map/mapFind.ts#L5)

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
