# Function: timeout()

> **timeout**\<`T`, `TFunc`, `Result`\>(`timeout`, ...`values`): [`IPromisE_Timeout`](../type-aliases/IPromisE_Timeout.md)\<`Result`\>

Defined in: [packages/promise/src/timeout.ts:63](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/promise/src/timeout.ts#L63)

**`Function`**

PromisE.timeout

## Type Parameters

### T

`T` *extends* \[`unknown`, `...unknown[]`\]

### TFunc

`TFunc` *extends* keyof [`TimeoutFunc`](../type-aliases/TimeoutFunc.md)\<`T`\>

### Result

`Result` = `T`\[`"length"`\] *extends* `1` ? `Awaited`\<`T`\[`0`\]\> : `Awaited`\<`ReturnType`\<[`TimeoutFunc`](../type-aliases/TimeoutFunc.md)\<`T`\>\[`TFunc`\]\>\>

## Parameters

### timeout

(optional) timeout duration in milliseconds.
                 Default: `10000` (10 seconds)

`number` | [`TimeoutOptions`](../type-aliases/TimeoutOptions.md)\<`TFunc`\>

### values

...`T`

promise/function: one or more promises as individual arguments

## Returns

[`IPromisE_Timeout`](../type-aliases/IPromisE_Timeout.md)\<`Result`\>

## Examples

```typescript
PromisE.timeout(
  5000, // timeout after 5000ms
  PromisE.delay(1000), // resolves after 1000ms with value 1000
).then(console.log)
// Result: 1000
```

```typescript
PromisE.timeout(
    5000, // timeout after 5000ms
    PromisE.delay(1000), // resolves after 1000ms with value 1000
    PromisE.delay(2000), // resolves after 2000ms with value 2000
    PromisE.delay(3000), // resolves after 3000ms with value 3000
).then(console.log)
// Result: [ 1000, 2000, 3000 ]
```

```typescript
PromisE.timeout(
    5000, // timeout after 5000ms
    PromisE.delay(20000), // resolves after 20000ms with value 20000
).catch(console.error)
// Error: Error('Timed out after 5000ms')
```

// Eg: when API request is taking longer than expected, print a message but not reject the promise.
```typescript
const promise = PromisE.timeout(
    5000, // timeout after 5000ms
    PromisE.delay(20000), // data promise, resolves after 20000ms with value 20000
)
const data = await promise.catch(err => {
    // promise did not time out, but was rejected because one of the data promises rejected
    if (!promise.timedout) return Promise.reject(err)

    // promise timed out >> print/update UI
    console.log('Request is taking longer than expected......')
    // now return the data promise (the promise(s) provided in the PromisE.timeout())
    return promise.data
})
```
