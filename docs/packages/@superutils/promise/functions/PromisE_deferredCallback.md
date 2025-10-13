# Function: PromisE\_deferredCallback()

> **PromisE\_deferredCallback**\<`TDefault`, `CbArgs`\>(`callback`, `options`): \<`TResult`\>(...`args`) => [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

Defined in: [packages/promise/src/deferredCallback.ts:63](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/promise/src/deferredCallback.ts#L63)

## Type Parameters

### TDefault

`TDefault`

### CbArgs

`CbArgs` *extends* `unknown`[] = `unknown`[]

## Parameters

### callback

(...`args`) => `TDefault` \| `Promise`\<`TDefault`\>

### options

[`DeferredOptions`](../type-aliases/DeferredOptions.md) = `{}`

## Returns

deferred/throttled callback function

> \<`TResult`\>(...`args`): [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

### Type Parameters

#### TResult

`TResult` = `TDefault`

### Parameters

#### args

...`CbArgs`

### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

## Examples

```typescript
const handleChange = (e: { target: { value: number }}) => console.log(e.target.value)
const handleChangeDeferred = PromisE.deferredCallback(handleChange, {
    delayMs: 300,
    throttle: false,
})
// simulate click events call after prespecified delay
const delays = [
    100,
    150,
    200,
    550,
    580,
    600,
    1000,
    1100,
]
delays.forEach(timeout =>
    setTimeout(() => handleChangeDeferred({
       target: { value: timeout }
    }), timeout)
)

// Prints:
// 200, 600, 1100
```

```typescript
const handleChange = (e: { target: { value: number }}) => console.log(e.target.value)
const handleChangeDeferred = PromisE.deferredCallback(handleChange, {
    delayMs: 300,
    throttle: true,
})
// simulate click events call after prespecified delay
const delays = [
    100,
    150,
    200,
    550,
    580,
    600,
    1000,
    1100,
]
delays.forEach(timeout =>
    setTimeout(() => handleChangeDeferred({
       target: { value: timeout }
    }), timeout)
)
// Prints: 100, 550, 1100
```
