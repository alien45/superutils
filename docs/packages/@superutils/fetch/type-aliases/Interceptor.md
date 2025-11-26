# Type Alias: Interceptor()\<T, TArgs, TArgsCb\>

> **Interceptor**\<`T`, `TArgs`, `TArgsCb`\> = (...`args`) => [`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`void`\> \| [`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`T`\>

Defined in: [packages/fetch/src/types.ts:302](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/fetch/src/types.ts#L302)

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
