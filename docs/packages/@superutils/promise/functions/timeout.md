# Function: timeout()

## Call Signature

> **timeout**\<`T`, `Result`\>(`timeout`, ...`values`): [`IPromisE_Timeout`](../type-aliases/IPromisE_Timeout.md)\<`Result`\>

Defined in: [packages/promise/src/timeout.ts:81](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/promise/src/timeout.ts#L81)

Creates a new promise that wraps one or more promises and rejects if they do not settle within a
specified timeout duration. When multiple promises are provided, they can be processed using methods like
 `all` (default), `race`, `any`, or `allSettled`.

### Type Parameters

#### T

`T` *extends* \[`unknown`, `...unknown[]`\]

#### Result

`Result` = `T`\[`"length"`\] *extends* `1` ? `Awaited`\<`T`\[`0`\]\> : `Awaited`\<`T`\[`number`\]\>[]

### Parameters

#### timeout

`number`

(optional) timeout duration in milliseconds.
Default: `10000` (10 seconds)

#### values

...`T`

### Returns

[`IPromisE_Timeout`](../type-aliases/IPromisE_Timeout.md)\<`Result`\>

### Examples

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
    PromisE.delay(20000), // resolves after 20000ms with value 20000
).catch(console.error)
// Error: Error('Timed out after 5000ms')
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

Eg: when API request is taking longer than expected, print a message avoid rejecting the promise.
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
    // Now return the data promise which is the result of `PromisE.all(promises)` (default).
    return promise.data
})
```

```typescript
PromisE.timeout(
    { // instead of `timeout: number` an object can be used for additional options
        func: 'race', // tells PromisE.timeout to use `PromisE.race(promises)`
        timeout: 5000, // timeout after 5000ms
        timeoutMsg: 'My custom timed out message',
    },
    PromisE.delay(1000), // resolves after 1000ms with value 1000
    PromisE.delay(2000), // resolves after 2000ms with value 2000
    PromisE.delay(3000), // resolves after 3000ms with value 3000
).then(console.log)
// Result: 1000 (Result of `Promise.race(promises)`)
```

## Call Signature

> **timeout**\<`T`, `TFunc`, `Result`\>(`options`, ...`values`): [`IPromisE_Timeout`](../type-aliases/IPromisE_Timeout.md)\<`Result`\>

Defined in: [packages/promise/src/timeout.ts:102](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/promise/src/timeout.ts#L102)

### Type Parameters

#### T

`T` *extends* \[`unknown`, `...unknown[]`\]

#### TFunc

`TFunc` *extends* keyof [`TimeoutFunc`](../type-aliases/TimeoutFunc.md)\<`T`\>

#### Result

`Result` = `T`\[`"length"`\] *extends* `1` ? `Awaited`\<`T`\[`0`\]\> : `Awaited`\<`ReturnType`\<[`TimeoutFunc`](../type-aliases/TimeoutFunc.md)\<`T`\>\[`TFunc`\]\>\>

### Parameters

#### options

[`TimeoutOptions`](../type-aliases/TimeoutOptions.md)\<`TFunc`\>

An options object can be passed with one or more of the following properties:

#### values

...`T`

### Returns

[`IPromisE_Timeout`](../type-aliases/IPromisE_Timeout.md)\<`Result`\>
