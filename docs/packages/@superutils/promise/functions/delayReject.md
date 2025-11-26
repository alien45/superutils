# Function: delayReject()

> **delayReject**\<`T`\>(`duration`, `reason?`): [`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\>

Defined in: [packages/promise/src/delayReject.ts:35](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/promise/src/delayReject.ts#L35)

**`Function`**

PromisE.delayReject

## Type Parameters

### T

`T` = `never`

## Parameters

### duration

`number`

### reason?

`unknown`

## Returns

[`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\>

## Examples

```typescript
const rejectPromise = PromisE.delayReject(
    3000, // duration in milliseconds
    new Error('App did not initialization on time'), // reason to reject with
)
await rejectPromise // throws error message after 3 seconds
codeThatWillNotExecute()
```

```typescript

const rejectPromise = PromisE.delayReject<string>(
    3000,
    new Error('App did not initialization on time'),
)
let count = 0
const appReady = () => ++count >= 2 // return true on second call
const intervalId = setInterval(() => {
    if (!appReady()) return
    rejectPromise.resolve('force resolves rejectPromise and execution continues')
    clearInterval(intervalId)
}, 100)
await rejectPromise
console.log('App is now ready')
```
