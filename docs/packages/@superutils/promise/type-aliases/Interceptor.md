# Type Alias: Interceptor()\<T, TArgs, TArgsCb\>

> **Interceptor**\<`T`, `TArgs`, `TArgsCb`\> = (...`args`) => [`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`void`\> \| [`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`T`\>

Defined in: [packages/promise/src/types/fetch.ts:303](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/fetch.ts#L303)

Generic fetch interceptor type

## Type Parameters

### T

`T`

### TArgs

`TArgs` *extends* `any`[]

### TArgsCb

`TArgsCb` *extends* `any`[] = \[`T`, `...TArgs`\]

## Parameters

### args

...`TArgsCb`

## Returns

[`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`void`\> \| [`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`T`\>
