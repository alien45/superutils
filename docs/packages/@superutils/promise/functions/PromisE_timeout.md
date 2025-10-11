# Function: PromisE\_timeout()

> **PromisE\_timeout**\<`T`, `TOut`\>(`timeout`, ...`values`): [`IPromisE_Timeout`](../type-aliases/IPromisE_Timeout.md)\<`TOut`\>

Defined in: [packages/promise/src/timeout.ts:61](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/timeout.ts#L61)

## Type Parameters

### T

`T` *extends* `any`[] \| \[\]

### TOut

`TOut` = `T`\[`"length"`\] *extends* `1` ? `T`\[`0`\] : `T`

## Parameters

### timeout

`number` = `10_000`

(optional) timeout duration in milliseconds.
                 Default: `10000` (10 seconds)

### values

...`Promise`\<`TOut`\>[]

promise/function: one or more promises as individual arguments

## Returns

[`IPromisE_Timeout`](../type-aliases/IPromisE_Timeout.md)\<`TOut`\>

## Name

PromisE.timeout

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
