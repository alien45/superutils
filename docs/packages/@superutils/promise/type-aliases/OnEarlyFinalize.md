# Type Alias: OnEarlyFinalize()\<T\>

> **OnEarlyFinalize**\<`T`\> = \<`TResolved`, `TValue`\>(`resolved`, `resultOrReason`) => [`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`unknown`\>

Defined in: [packages/promise/src/types/IPromisE.ts:91](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/promise/src/types/IPromisE.ts#L91)

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
