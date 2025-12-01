# Type Alias: Interceptor()\<T, TArgs, TArgsCb\>

> **Interceptor**\<`T`, `TArgs`, `TArgsCb`\> = (...`args`) => `ValueOrPromise`\<`void`\> \| `ValueOrPromise`\<`T`\>

Defined in: [packages/fetch/src/types.ts:304](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/fetch/src/types.ts#L304)

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
