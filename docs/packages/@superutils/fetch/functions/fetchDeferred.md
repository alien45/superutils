# Function: fetchDeferred()

> **fetchDeferred**\<`TArgs`, `ThisArg`\>(`deferOptions`, ...`defaultArgs`): \<`TResult`\>(...`args`) => `IPromisE`\<`TResult`\>

Defined in: [packages/fetch/src/fetchDeferred.ts:35](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/fetch/src/fetchDeferred.ts#L35)

## Type Parameters

### TArgs

`TArgs` *extends* [`FetchDeferredArgs`](../type-aliases/FetchDeferredArgs.md)

### ThisArg

`ThisArg` = `unknown`

## Parameters

### deferOptions

`DeferredOptions`\<`ThisArg`\> = `{}`

### defaultArgs

...`TArgs`

## Returns

> \<`TResult`\>(...`args`): `IPromisE`\<`TResult`\>

### Type Parameters

#### TResult

`TResult` = `unknown`

### Parameters

#### args

...`CbArgs`

### Returns

`IPromisE`\<`TResult`\>

## Example

```typescript
import PromisE from '@superutils/promise'

const getProducts = PromisE.deferredFetch({
    delayMs: 300, // used for both "throttle" and "deferred" modes
    resolveIgnored: ResolveIgnored.WITH_LAST,
    throttle: true,
})

// first call
getProducts('https://dummyjson.com/products/1').then(console.log)
// seconds call after delay
setTimeout(()=> getProducts('https://dummyjson.com/products/2').then(console.log), 200)

// Possible outcomes using different options:
// - `throttle = true`: only product 1 retrieved
// - `throttle = false`: only product 2 retrieved
// - `resolveIgnored = ResolveIgnored.WITH_LAST`:
// 	only product retrieved but both request will resolve the same result
// - `resolveIgnored = ResolveIgnored.WITH_UNDEFINED`:
// only product 1 retrieved & resolved but the other will resolve with undefined
// - `resolveIgnored = ResolveIgnored.NEVER`: only one product retrieved & resolved but the other will NEVER resolve
```
