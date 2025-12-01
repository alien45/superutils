# Type Alias: Interceptor()\<T, TArgs, TArgsCb\>

> **Interceptor**\<`T`, `TArgs`, `TArgsCb`\> = (...`args`) => `ValueOrPromise`\<`void`\> \| `ValueOrPromise`\<`T`\>

Defined in: [packages/fetch/src/types.ts:304](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/fetch/src/types.ts#L304)

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

`ValueOrPromise`\<`void`\> \| `ValueOrPromise`\<`T`\>
