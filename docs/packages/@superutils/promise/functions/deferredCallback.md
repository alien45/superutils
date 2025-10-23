# Function: deferredCallback()

> **deferredCallback**\<`TDefault`, `CbArgs`\>(`callback`, `options`): \<`TResult`\>(...`args`) => [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

Defined in: [packages/promise/src/deferredCallback.ts:67](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/deferredCallback.ts#L67)

**`Function`**

PromisE.deferredCallback

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

deferred/throttled function

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
