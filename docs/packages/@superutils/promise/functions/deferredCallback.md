# Function: deferredCallback()

> **deferredCallback**\<`TDefault`, `CbArgs`\>(`callback`, `options`): \<`TResult`\>(...`args`) => [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

Defined in: [packages/promise/src/deferredCallback.ts:36](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/promise/src/deferredCallback.ts#L36)

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

## Example

```typescript
import PromisE from '@superutils/promise'

// Input change handler
const handleChange = (e: { target: { value: number } }) =>
	   console.log(e.target.value)
// Change handler with `PromisE.deferred()`
const handleChangeDeferred = PromisE.deferredCallback(handleChange, {
	   delayMs: 300,
	   throttle: false,
})
// Simulate input change events after prespecified delays
const delays = [100, 150, 200, 550, 580, 600, 1000, 1100]
delays.forEach(timeout =>
	   setTimeout(
	   	   () => handleChangeDeferred({ target: { value: timeout } }),
	   	   timeout,
	   ),
)
// Prints:
// 200, 600, 1100
```
