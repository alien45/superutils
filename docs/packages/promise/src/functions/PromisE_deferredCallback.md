# Function: PromisE\_deferredCallback()

> **PromisE\_deferredCallback**\<`TDefault`, `CbArgs`\>(`callback`, `options`): \<`TResult`\>(...`args`) => [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

Defined in: [packages/promise/src/deferredCallback.ts:38](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/deferredCallback.ts#L38)

## Type Parameters

### TDefault

`TDefault`

### CbArgs

`CbArgs` *extends* `any`[] = `any`[]

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

## Example

```ts
```typescript
const handleChange = (e: { target: { value: number }}) => console.log(e.target.value)
const handleChangeDeferred = PromisE.deferredCallback(handleChange, {
    delayMs: 300,
    throttle: false, // throttle with delay duration set in `defer`
})
// simulate click event
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

// Result (defer: 300, throttle: true): uses throttled()
// 100, 550, 1100

// Result (defer: 300, throttle: false): uses deferred()
// 200, 600, 1100
```
```
