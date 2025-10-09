# Function: PromisE\_deferred()

> **PromisE\_deferred**\<`T`\>(`options`): \<`TResult`\>(`promise`) => [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

Defined in: [packages/promise/src/deferred.ts:89](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/deferred.ts#L89)

## Type Parameters

### T

`T`

## Parameters

### options

[`DeferredOptions`](../type-aliases/DeferredOptions.md) = `{}`

(optional) options

## Returns

a callback that is invoked in one of the followin 3 methods:
- sequential: when `delayMs` is not a positive number.
- debounced: when `delayMs > 0` and `throttle = false`
- throttled: when `delayMs > 0` and `throttle = true`

---

> \<`TResult`\>(`promise`): [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

### Type Parameters

#### TResult

`TResult` = `T`

### Parameters

#### promise

`Promise`\<`TResult`\> | () => `Promise`\<`TResult`\>

### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

## Name

PromisE.deferred

## Description

The main difference is that:
 - Notes:
     1. A "request" simply means invokation of the returned callback function
     2. By "handled" it means a "request" will be resolved or rejected.
 - `PromisE.deferred` is to be used with promises/functions
 - There is no specific time delay.
 - The time when a request is completed is irrelevant.
 - If not throttled:
     1. Once a request is handled, all previous requests will be ignored and pool starts anew.
     2. If a function is provided in the  returned callback, ALL of them will be invoked, regardless of pool size.
     3. The last/only request in an on-going requests' pool will handled (resolve/reject).
 - If throttled:
     1. Once a requst starts executing, subsequent requests will be added to a queue.
     2. The last/only item in the queue will be handled. Rest will be ignored.
     3. If a function is provided in the returned callback, it will be invoked only if the request is handled.
     Thus, improving performance by avoiding unnecessary invokations.
     4. If every single request/function needs to be invoked, avoid using throttle.

 - If throttled and `strict` is truthy, all subsequent request while a request is being handled will be ignored.

---

## Example

```typescript
const example = throttle => {
    const df = PromisE.deferred(throttle)
    df(() => PromisE.delay(5000)).then(console.log)
    df(() => PromisE.delay(500)).then(console.log)
    df(() => PromisE.delay(1000)).then(console.log)
    // delay 2 seconds and invoke df() again
    setTimeout(() => {
        df(() => PromisE.delay(200)).then(console.log)
    }, 2000)
}

// Without throttle
example(false)
// `1000` and `200` will be printed in the console

// with throttle
example(true)
// `5000` and `200` will be printed in the console

// with throttle with strict mode
example(true)
// `5000` will be printed in the console
```
