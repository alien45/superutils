# Type Alias: OnEarlyFinalize()\<T\>

> **OnEarlyFinalize**\<`T`\> = \<`TResolved`, `TValue`\>(`resolved`, `resultOrReason`) => [`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`unknown`\>

Defined in: [packages/promise/src/types/IPromisE.ts:85](https://github.com/alien45/utiils/blob/1eb281bb287b81b48f87f780196f814d5c255c8a/packages/promise/src/types/IPromisE.ts#L85)

## Type Parameters

### T

`T`

## Type Parameters

### TResolved

`TResolved` *extends* `boolean`

### TValue

`TValue` = `TResolved` *extends* `true` ? `T` : `unknown`

## Parameters

### resolved

`TResolved`

### resultOrReason

`TValue`

## Returns

[`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`unknown`\>
