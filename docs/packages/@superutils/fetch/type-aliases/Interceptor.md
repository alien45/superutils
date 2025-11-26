# Type Alias: Interceptor()\<T, TArgs, TArgsCb\>

> **Interceptor**\<`T`, `TArgs`, `TArgsCb`\> = (...`args`) => [`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`void`\> \| [`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`T`\>

Defined in: [packages/fetch/src/types.ts:302](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/fetch/src/types.ts#L302)

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
