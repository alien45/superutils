# Function: PromisE\_delay()

> **PromisE\_delay**\<`T`, `TReject`, `TResultOrErr`\>(`duration`, `result`, `asRejected`, `timeoutErrMsg?`): [`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\>

Defined in: [packages/promise/src/delay.ts:24](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/promise/src/delay.ts#L24)

**`Function`**

PromisE.delay

## Type Parameters

### T

`T` = `number`

### TReject

`TReject` *extends* `boolean` = `boolean`

### TResultOrErr

`TResultOrErr` = `TReject` *extends* `true` ? `unknown` : `T`

## Parameters

### duration

`number` = `100`

duration in milliseconds

### result

`TResultOrErr` = `...`

(optional) specify a value to resolve or reject with.
                             Default: `delayMs` when resolved or timed out error when rejected

### asRejected

`TReject` = `...`

(optional) if `true`, will reject the promise after the delay.

### timeoutErrMsg?

`string`

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
