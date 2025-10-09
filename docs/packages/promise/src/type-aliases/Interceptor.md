# Type Alias: Interceptor()\<T, TArgs, TArgsCb\>

> **Interceptor**\<`T`, `TArgs`, `TArgsCb`\> = (...`args`) => `ValueOrPromise`\<`void`\> \| `ValueOrPromise`\<`T`\>

Defined in: [packages/promise/src/types/fetch.ts:305](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L305)

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

`ValueOrPromise`\<`void`\> \| `ValueOrPromise`\<`T`\>
