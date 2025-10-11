# Function: PromisE\_delay()

> **PromisE\_delay**\<`T`\>(`duration`, `result`, `asRejected`, `timeoutErrMsg?`): [`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\>

Defined in: [packages/promise/src/delay.ts:23](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/delay.ts#L23)

## Type Parameters

### T

`T` = `number`

## Parameters

### duration

`number` = `100`

duration in milliseconds

### result

`T` = `...`

(optional) specify a value to resolve or reject with.
                             Default: `delayMs` when resolved or timed out error when rejected

### asRejected

`boolean` = `false`

(optional) if `true`, will reject the promise after the delay.

### timeoutErrMsg?

`string`

## Returns

[`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\>

See [IPromisE\_Delay](../interfaces/IPromisE_Delay.md)

## Name

PromisE.delay

## Example
