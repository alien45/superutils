# Function: PromisE\_deferredFetch()

> **PromisE\_deferredFetch**\<`TArgs`, `ThisArg`\>(`deferOptions`, ...`defaultArgs`): \<`TResult`\>(...`args`) => [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

Defined in: [packages/promise/src/deferredFetch.ts:33](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/deferredFetch.ts#L33)

## Type Parameters

### TArgs

`TArgs` *extends* [`FetchDeferredArgs`](../type-aliases/FetchDeferredArgs.md)

### ThisArg

`ThisArg` = `unknown`

## Parameters

### deferOptions

[`DeferredOptions`](../type-aliases/DeferredOptions.md)\<`ThisArg`\> = `{}`

### defaultArgs

...`TArgs`

## Returns

> \<`TResult`\>(...`args`): [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

### Type Parameters

#### TResult

`TResult` = `unknown`

### Parameters

#### args

...`CbArgs`

### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

## Name

PromisE.deferredFetch

## Example

```ts
```typescript
---
// Example: Fetch paginated products
const getProducts = PromisE.deferredFetch({
    delayMs: 300, // used for both "throttle" and "deferred" modes
    resolveIgnored: ResolveIgnored.WITH_ACTIVE,
    throttle: true,
})
getProducts('https://dummyjson.com/products/1').then(console.log)
setTimeout(()=> getProducts('https://dummyjson.com/products/2').then(console.log), 200)
// result (throttle = true): only product 1 retrieved

// result (throttle = false): only product 2 retrieved

// result (ResolveIgnored.WITH_ACTIVE): only product retrieved but both request will resolve the same result

// result (ResolveIgnored.WITH_UNDEFINED): only one product retrieved & resolved but the other will resolve with undefined

// result (ResolveIgnored.NEVER): only one product retrieved & resolved but the other will NEVER resolve
```
```
