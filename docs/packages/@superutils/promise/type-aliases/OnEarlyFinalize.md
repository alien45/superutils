# Type Alias: OnEarlyFinalize()\<T\>

> **OnEarlyFinalize**\<`T`\> = \<`TResolved`, `TValue`\>(`resolved`, `resultOrReason`) => [`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`unknown`\>

Defined in: [packages/promise/src/types/IPromisE.ts:85](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/types/IPromisE.ts#L85)

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
