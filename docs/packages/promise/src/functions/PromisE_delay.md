# Function: PromisE\_delay()

> **PromisE\_delay**\<`T`\>(`duration`, `result`, `asRejected`, `timeoutErrMsg?`): [`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\>

Defined in: [packages/promise/src/delay.ts:23](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/delay.ts#L23)

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
