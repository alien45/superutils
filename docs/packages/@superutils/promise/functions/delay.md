# Function: delay()

> **delay**\<`T`, `TReject`\>(`duration`, `result`, `asRejected`): [`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\>

Defined in: [packages/promise/src/delay.ts:24](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/delay.ts#L24)

**`Function`**

PromisE.delay

## Type Parameters

### T

`T` = `number`

### TReject

`TReject` *extends* `boolean` = `boolean`

## Parameters

### duration

`number` = `100`

duration in milliseconds

### result

`T` = `...`

(optional) specify a value to resolve or reject with.
                             Default: `delayMs` when resolved or timed out error when rejected

### asRejected

`TReject` = `...`

(optional) if `true`, will reject the promise after the delay.

## Returns

[`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\>

See [IPromisE\_Delay](../interfaces/IPromisE_Delay.md)

## Example

```typescript
console.log('Waiting for app initialization or something else to be ready')
// wait 3 seconds before proceeding
await PromisE.delay(3000)
console.log('App ready')
```
