# Type Alias: OnEarlyFinalize()\<T\>

> **OnEarlyFinalize**\<`T`\> = \<`TResolved`, `TValue`\>(`resolved`, `resultOrReason`) => `ValueOrPromise`\<`unknown`\>

Defined in: [packages/promise/src/types/IPromisE.ts:85](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/promise/src/types/IPromisE.ts#L85)

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

`ValueOrPromise`\<`unknown`\>
