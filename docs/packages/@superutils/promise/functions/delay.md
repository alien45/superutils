# Function: delay()

> **delay**\<`T`, `TReject`\>(`duration`, `result`, `asRejected`): [`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\>

Defined in: [packages/promise/src/delay.ts:35](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/promise/src/delay.ts#L35)

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

(optional) specify a value to resolve or reject with.
                             Default: `delayMs` when resolved or timed out error when rejected

`T` | () => `T`

### asRejected

`TReject` = `...`

(optional) if `true`, will reject the promise after the delay.

## Returns

[`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\>

See [IPromisE\_Delay](../interfaces/IPromisE_Delay.md)

## Examples

```typescript
import PromisE from '@superutils/promise'

console.log('Waiting for app initialization or something else to be ready')
// wait 3 seconds before proceeding
await PromisE.delay(3000)
console.log('App ready')
```

An awaitable `setTimeout()`.
```typescript
import PromisE from '@superutils/promise'

PromisE.delay(1000, () => console.log('Prints after 1 second delay'))
```
