# Type Alias: Interceptor()\<T, TArgs, TArgsCb\>

> **Interceptor**\<`T`, `TArgs`, `TArgsCb`\> = (...`args`) => [`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`void`\> \| [`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`T`\>

Defined in: [packages/fetch/src/types.ts:302](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/fetch/src/types.ts#L302)

Generic fetch interceptor type

## Type Parameters

### T

`T`

### TArgs

`TArgs` *extends* `unknown`[]

### TArgsCb

`TArgsCb` *extends* `unknown`[] = \[`T`, `...TArgs`\]

## Parameters

### args

...`TArgsCb`

## Returns

[`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`void`\> \| [`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`T`\>
