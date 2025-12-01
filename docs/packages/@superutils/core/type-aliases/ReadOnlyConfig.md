# Type Alias: ReadOnlyConfig\<T, Revocable\>

> **ReadOnlyConfig**\<`T`, `Revocable`\> = `object`

Defined in: [packages/core/src/obj/types.ts:7](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/obj/types.ts#L7)

## Type Parameters

### T

`T`

### Revocable

`Revocable` *extends* `true` \| `false` = `false`

## Properties

### add?

> `optional` **add**: `boolean` \| [`ReadOnlyAllowAddFn`](ReadOnlyAllowAddFn.md)\<`T`\>

Defined in: [packages/core/src/obj/types.ts:9](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/obj/types.ts#L9)

Whether to allow adding new properties. Default: `false`

***

### revocable?

> `optional` **revocable**: `Revocable`

Defined in: [packages/core/src/obj/types.ts:11](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/obj/types.ts#L11)

Default: `false`

***

### silent?

> `optional` **silent**: `boolean`

Defined in: [packages/core/src/obj/types.ts:13](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/obj/types.ts#L13)

Whether to throw error when a write operation is rejected. Default: `true`
