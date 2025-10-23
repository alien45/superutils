# Class: PromisE\<T\>

Defined in: [packages/promise/src/PromisE.ts:50](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisE.ts#L50)

An attempt to solve the problem of Promise status (pending/resolved/rejected) not being easily accessible externally.

For more example see static functions like `PromisE.deferred}, `PromisE.fetch}, `PromisE.timeout} etc.

## Examples

```typescript
import PromisE from '@superutils/promise'
const p = new PromisE((resolve, reject) => resolve('done'))
console.log(
 p.pending, // Indicates if promise has finalized (resolved/rejected)
 p.resolved, // Indicates if the promise has resolved
 p.rejected // Indicates if the promise has rejected
)
```

```typescript
import PromisE from '@superutils/promise'
const instance = new Promise((resolve) => setTimeout(() => resolve(1), 1000))
const p = new PromisE(instance)
console.log(p.pending)
```

```typescript
import PromisE from '@superutils/promise'
const p = new PromisE<number>()
setTimeout(() => p.resolve(1))
p.then(console.log)
```

```typescript
import PromisE from '@superutils/promise'
const p = PromisE.try(() => { throw new Error('I am a naughty function' ) })
p.catch(console.error)
```

## Extends

- [`PromisEBase`](PromisEBase.md)\<`T`\>

## Type Parameters

### T

`T` = `unknown`

## Constructors

### Constructor

> **new PromisE**\<`T`\>(...`args`): `PromisE`\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:18](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L18)

Create a PromisE instance as a drop-in replacement for Promise

#### Parameters

##### args

...\[(`resolve`, `reject`) => `void`\]

#### Returns

`PromisE`\<`T`\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`constructor`](PromisEBase.md#constructor)

### Constructor

> **new PromisE**\<`T`\>(`promise`): `PromisE`\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:20](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L20)

Extend an existing Promise instance to check status or finalize early

#### Parameters

##### promise

`Promise`\<`T`\>

#### Returns

`PromisE`\<`T`\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`constructor`](PromisEBase.md#constructor)

### Constructor

> **new PromisE**\<`T`\>(`value`): `PromisE`\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:22](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L22)

Create a resolved promise with value

#### Parameters

##### value

`T`

#### Returns

`PromisE`\<`T`\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`constructor`](PromisEBase.md#constructor)

### Constructor

> **new PromisE**\<`T`\>(): `PromisE`\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:35](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L35)

If executor function is not provided, the promise must be resolved/rejected externally.

#### Returns

`PromisE`\<`T`\>

#### Example

```typescript
// create a promise that will NEVER finalize automatically
const p = new PromisE<number>()
// resolve it manually
setTimeout(() => p.resolve(1), 1000)
p.then(console.log)
```

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`constructor`](PromisEBase.md#constructor)

## Properties

### \[toStringTag\]

> `readonly` **\[toStringTag\]**: `string`

Defined in: node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:176

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`[toStringTag]`](PromisEBase.md#tostringtag)

***

### onEarlyFinalize

> **onEarlyFinalize**: [`OnEarlyFinalize`](../type-aliases/OnEarlyFinalize.md)\<`T`\>[] = `[]`

Defined in: [packages/promise/src/PromisEBase.ts:15](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L15)

callbacks to be invoked whenever PromisE instance is finalized early using non-static resolve()/reject() methods

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`onEarlyFinalize`](PromisEBase.md#onearlyfinalize)

***

### state

> `readonly` **state**: `0` \| `1` \| `2` = `0`

Defined in: [packages/promise/src/PromisEBase.ts:9](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L9)

0: pending, 1: resolved, 2: rejected

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`state`](PromisEBase.md#state)

***

### \[species\]

> `readonly` `static` **\[species\]**: `PromiseConstructor`

Defined in: node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:180

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`[species]`](PromisEBase.md#species)

***

### config

> `static` **config**: `object`

Defined in: [packages/promise/src/PromisE.ts:52](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisE.ts#L52)

Global configuration & default values

#### deferOptions

> **deferOptions**: [`DeferredOptions`](../type-aliases/DeferredOptions.md)

Default value for `options` used by `PromisE.*deferred*` functions

#### delayTimeoutMsg

> **delayTimeoutMsg**: `string` = `'Timed out after'`

#### retryOptions

> **retryOptions**: `object`

##### retryOptions.retry

> **retry**: `number` = `1`

##### retryOptions.retryBackOff

> **retryBackOff**: `"exponential"` = `'exponential'`

##### retryOptions.retryDelay

> **retryDelay**: `number` = `300`

##### retryOptions.retryDelayJitter

> **retryDelayJitter**: `true` = `true`

##### retryOptions.retryDelayJitterMax

> **retryDelayJitterMax**: `number` = `100`

##### retryOptions.retryIf

> **retryIf**: `null` = `null`

***

### deferred()

> `static` **deferred**: \<`T`\>(`options`) => [`DeferredReturn`](../type-aliases/DeferredReturn.md)

Defined in: [packages/promise/src/PromisE.ts:54](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisE.ts#L54)

**`Function`**

PromisE.deferred

#### Type Parameters

##### T

`T`

#### Parameters

##### options

[`DeferredOptions`](../type-aliases/DeferredOptions.md) = `{}`

(optional) options

#### Returns

[`DeferredReturn`](../type-aliases/DeferredReturn.md)

a callback that is invoked in one of the followin 3 methods:
- sequential: when `delayMs <= 0` or `delayMs = undefined`
- debounced: when `delayMs > 0` and `throttle = false`
- throttled: when `delayMs > 0` and `throttle = true`

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

#### Example

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

***

### deferredCallback()

> `static` **deferredCallback**: \<`TDefault`, `CbArgs`\>(`callback`, `options`) => \<`TResult`\>(...`args`) => [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

Defined in: [packages/promise/src/PromisE.ts:56](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisE.ts#L56)

**`Function`**

PromisE.deferredCallback

#### Type Parameters

##### TDefault

`TDefault`

##### CbArgs

`CbArgs` *extends* `unknown`[] = `unknown`[]

#### Parameters

##### callback

(...`args`) => `TDefault` \| `Promise`\<`TDefault`\>

##### options

[`DeferredOptions`](../type-aliases/DeferredOptions.md) = `{}`

#### Returns

deferred/throttled function

> \<`TResult`\>(...`args`): [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

##### Type Parameters

###### TResult

`TResult` = `TDefault`

##### Parameters

###### args

...`CbArgs`

##### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

#### Examples

```typescript
const handleChange = (e: { target: { value: number }}) => console.log(e.target.value)
const handleChangeDeferred = PromisE.deferredCallback(handleChange, {
    delayMs: 300,
    throttle: false,
})
// simulate click events call after prespecified delay
const delays = [
    100,
    150,
    200,
    550,
    580,
    600,
    1000,
    1100,
]
delays.forEach(timeout =>
    setTimeout(() => handleChangeDeferred({
       target: { value: timeout }
    }), timeout)
)

// Prints:
// 200, 600, 1100
```

```typescript
const handleChange = (e: { target: { value: number }}) => console.log(e.target.value)
const handleChangeDeferred = PromisE.deferredCallback(handleChange, {
    delayMs: 300,
    throttle: true,
})
// simulate click events call after prespecified delay
const delays = [
    100,
    150,
    200,
    550,
    580,
    600,
    1000,
    1100,
]
delays.forEach(timeout =>
    setTimeout(() => handleChangeDeferred({
       target: { value: timeout }
    }), timeout)
)
// Prints: 100, 550, 1100
```

***

### delay()

> `static` **delay**: \<`T`, `TReject`\>(`duration`, `result`, `asRejected`) => [`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\>

Defined in: [packages/promise/src/PromisE.ts:58](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisE.ts#L58)

**`Function`**

PromisE.delay

#### Type Parameters

##### T

`T` = `number`

##### TReject

`TReject` *extends* `boolean` = `boolean`

#### Parameters

##### duration

`number` = `100`

duration in milliseconds

##### result

`T` = `...`

(optional) specify a value to resolve or reject with.
                             Default: `delayMs` when resolved or timed out error when rejected

##### asRejected

`TReject` = `...`

(optional) if `true`, will reject the promise after the delay.

#### Returns

[`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\>

See [IPromisE\_Delay](../interfaces/IPromisE_Delay.md)

#### Example

```typescript
console.log('Waiting for app initialization or something else to be ready')
// wait 3 seconds before proceeding
await PromisE.delay(3000)
console.log('App ready')
```

***

### delayReject()

> `static` **delayReject**: \<`T`\>(`duration`, `reason?`) => [`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\>

Defined in: [packages/promise/src/PromisE.ts:60](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisE.ts#L60)

**`Function`**

PromisE.delayReject

#### Type Parameters

##### T

`T` = `never`

#### Parameters

##### duration

`number`

##### reason?

`unknown`

#### Returns

[`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\>

#### Examples

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

***

### retry()

> `static` **retry**: \<`T`\>(`func`, `options?`) => `Promise`\<`T`\>

Defined in: [packages/promise/src/PromisE.ts:62](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisE.ts#L62)

Executes a function and retries it on failure or until a specific condition is met.

The function will be re-executed if:
1. The `func` promise rejects or the function throws an error.
2. The optional `retryIf` function returns `true`.

Retries will stop when the `retry` count is exhausted, or when `func` executes successfully
(resolves without error) AND the `retryIf` (if provided) returns `false`.

#### Type Parameters

##### T

`T`

The type of the value that the `func` returns/resolves to.

#### Parameters

##### func

() => [`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`T`\>

The function to execute. It can be synchronous or asynchronous.

##### options?

[`RetryOptions`](../type-aliases/RetryOptions.md)\<`T`\> = `{}`

(optional) Options for configuring the retry mechanism.

#### Returns

`Promise`\<`T`\>

A promise that resolves with the result of the last successful execution of `func`.
If all retries fail (either by throwing an error or by the condition function always returning true),
it resolves with `undefined`. Errors thrown by `func` are caught and handled internally, not re-thrown.

***

### timeout()

> `static` **timeout**: \<`T`, `TOut`\>(`timeout`, ...`values`) => [`IPromisE_Timeout`](../type-aliases/IPromisE_Timeout.md)\<`TOut`\>

Defined in: [packages/promise/src/PromisE.ts:64](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisE.ts#L64)

**`Function`**

PromisE.timeout

#### Type Parameters

##### T

`T` *extends* `unknown`[] \| \[\]

##### TOut

`TOut` = `T`\[`"length"`\] *extends* `1` ? `T`\[`0`\] : `T`

#### Parameters

##### timeout

`number` = `10_000`

(optional) timeout duration in milliseconds.
                 Default: `10000` (10 seconds)

##### values

...`Promise`\<`TOut`\>[]

promise/function: one or more promises as individual arguments

#### Returns

[`IPromisE_Timeout`](../type-aliases/IPromisE_Timeout.md)\<`TOut`\>

#### Examples

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

## Accessors

### pending

#### Get Signature

> **get** **pending**(): `boolean`

Defined in: [packages/promise/src/PromisEBase.ts:72](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L72)

Indicates if the promise is still pending/unfinalized

##### Returns

`boolean`

Indicates if the promise is still pending/unfinalized

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`pending`](PromisEBase.md#pending)

***

### rejected

#### Get Signature

> **get** **rejected**(): `boolean`

Defined in: [packages/promise/src/PromisEBase.ts:77](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L77)

Indicates if the promise has been rejected

##### Returns

`boolean`

Indicates if the promise has been rejected

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`rejected`](PromisEBase.md#rejected)

***

### resolved

#### Get Signature

> **get** **resolved**(): `boolean`

Defined in: [packages/promise/src/PromisEBase.ts:82](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L82)

Indicates if the promise has been resolved

##### Returns

`boolean`

Indicates if the promise has been resolved

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`resolved`](PromisEBase.md#resolved)

## Methods

### catch()

> **catch**\<`TResult`\>(`onrejected?`): `Promise`\<`T` \| `TResult`\>

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1564

Attaches a callback for only the rejection of the Promise.

#### Type Parameters

##### TResult

`TResult` = `never`

#### Parameters

##### onrejected?

The callback to execute when the Promise is rejected.

`null` | (`reason`) => `TResult` \| `PromiseLike`\<`TResult`\>

#### Returns

`Promise`\<`T` \| `TResult`\>

A Promise for the completion of the callback.

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`catch`](PromisEBase.md#catch)

***

### finally()

> **finally**(`onfinally?`): `Promise`\<`T`\>

Defined in: node\_modules/typescript/lib/lib.es2018.promise.d.ts:29

Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
resolved value cannot be modified from the callback.

#### Parameters

##### onfinally?

The callback to execute when the Promise is settled (fulfilled or rejected).

`null` | () => `void`

#### Returns

`Promise`\<`T`\>

A Promise for the completion of the callback.

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`finally`](PromisEBase.md#finally)

***

### reject()

> **reject**(`reason`): `void`

Defined in: [packages/promise/src/PromisEBase.ts:103](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L103)

Reject pending promise early.

#### Parameters

##### reason

`unknown`

#### Returns

`void`

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`reject`](PromisEBase.md#reject)

***

### resolve()

> **resolve**(`value`): `void`

Defined in: [packages/promise/src/PromisEBase.ts:93](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L93)

Resovle pending promise early.

#### Parameters

##### value

`T`

#### Returns

`void`

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`resolve`](PromisEBase.md#resolve)

***

### then()

> **then**\<`TResult1`, `TResult2`\>(`onfulfilled?`, `onrejected?`): `Promise`\<`TResult1` \| `TResult2`\>

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1557

Attaches callbacks for the resolution and/or rejection of the Promise.

#### Type Parameters

##### TResult1

`TResult1` = `T`

##### TResult2

`TResult2` = `never`

#### Parameters

##### onfulfilled?

The callback to execute when the Promise is resolved.

`null` | (`value`) => `TResult1` \| `PromiseLike`\<`TResult1`\>

##### onrejected?

The callback to execute when the Promise is rejected.

`null` | (`reason`) => `TResult2` \| `PromiseLike`\<`TResult2`\>

#### Returns

`Promise`\<`TResult1` \| `TResult2`\>

A Promise for the completion of which ever callback is executed.

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`then`](PromisEBase.md#then)

***

### all()

> `static` **all**\<`T`\>(`values`): [`IPromisE`](../interfaces/IPromisE.md)\<\{ -readonly \[P in string \| number \| symbol\]: Awaited\<T\[P\<P\>\]\> \}\>

Defined in: [packages/promise/src/PromisEBase.ts:121](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L121)

Sugar for `new PromisE(Promise.all(...))`

#### Type Parameters

##### T

`T` *extends* \[\] \| readonly `unknown`[]

#### Parameters

##### values

`T`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<\{ -readonly \[P in string \| number \| symbol\]: Awaited\<T\[P\<P\>\]\> \}\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`all`](PromisEBase.md#all)

***

### allSettled()

> `static` **allSettled**\<`T`\>(`values`): [`IPromisE`](../interfaces/IPromisE.md)\<`PromiseSettledResult`\<`Awaited`\<`T`\[`number`\]\>\>[]\>

Defined in: [packages/promise/src/PromisEBase.ts:127](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L127)

Sugar for `new PromisE(Promise.allSettled(...))`

#### Type Parameters

##### T

`T` *extends* `unknown`[]

#### Parameters

##### values

`T`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`PromiseSettledResult`\<`Awaited`\<`T`\[`number`\]\>\>[]\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`allSettled`](PromisEBase.md#allsettled)

***

### any()

> `static` **any**\<`T`\>(`values`): [`IPromisE`](../interfaces/IPromisE.md)\<`T`\[`number`\]\>

Defined in: [packages/promise/src/PromisEBase.ts:133](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L133)

Sugar for `new PromisE(Promise.any(...))`

#### Type Parameters

##### T

`T` *extends* `unknown`[]

#### Parameters

##### values

`T`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`T`\[`number`\]\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`any`](PromisEBase.md#any)

***

### race()

> `static` **race**\<`T`\>(`values`): [`IPromisE`](../interfaces/IPromisE.md)\<`Awaited`\<`T`\>\>

Defined in: [packages/promise/src/PromisEBase.ts:137](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L137)

Sugar for `new PromisE(Promise.race(..))`

#### Type Parameters

##### T

`T`

#### Parameters

##### values

`T`[]

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`Awaited`\<`T`\>\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`race`](PromisEBase.md#race)

***

### reject()

> `static` **reject**\<`T`\>(`reason`): [`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:141](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L141)

Extends Promise.reject

#### Type Parameters

##### T

`T` = `never`

#### Parameters

##### reason

`unknown`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`reject`](PromisEBase.md#reject-2)

***

### resolve()

> `static` **resolve**\<`T`\>(`value?`): [`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

Defined in: [packages/promise/src/PromisEBase.ts:148](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L148)

Sugar for `new PromisE(Promise.resolve(...))`

#### Type Parameters

##### T

`T`

#### Parameters

##### value?

`T`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`resolve`](PromisEBase.md#resolve-2)

***

### try()

> `static` **try**\<`T`, `U`\>(`callbackFn`, ...`args`): [`IPromisE`](../interfaces/IPromisE.md)\<`Awaited`\<`T`\>\>

Defined in: [packages/promise/src/PromisEBase.ts:152](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L152)

Sugar for `new PromisE(Promise.try(...))`

#### Type Parameters

##### T

`T`

##### U

`U` *extends* `unknown`[]

#### Parameters

##### callbackFn

(...`args`) => `T` \| `PromiseLike`\<`T`\>

##### args

...`U`

#### Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`Awaited`\<`T`\>\>

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`try`](PromisEBase.md#try)

***

### withResolvers()

> `static` **withResolvers**\<`T`\>(): `object`

Defined in: [packages/promise/src/PromisEBase.ts:193](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/PromisEBase.ts#L193)

Creates a `PromisE` instance and returns it in an object, along with its `resolve` and `reject` functions.

NB: this function is technically no longer needed because the `PromisE` class already comes with the resolvers.

---

#### Type Parameters

##### T

`T` = `unknown`

#### Returns

`object`

##### promise

> **promise**: [`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

##### reject()

> **reject**: (`reason?`) => `void`

###### Parameters

###### reason?

`any`

###### Returns

`void`

##### resolve()

> **resolve**: (`value`) => `void`

###### Parameters

###### value

`T` | `PromiseLike`\<`T`\>

###### Returns

`void`

#### Examples

Using `PromisE` directly: simply provide an empty function as the executor

```typescript
import PromisE from '@superutils/promise'
const promisE = new PromisE<number>(() => {})
setTimeout(() => promisE.resolve(1), 1000)
promisE.then(console.log)
```

Using `withResolvers`
```typescript
import PromisE from '@superutils/promise'
const pwr = PromisE.withResolvers<number>()
setTimeout(() => pwr.resolve(1), 1000)
pwr.promise.then(console.log)
```

#### Inherited from

[`PromisEBase`](PromisEBase.md).[`withResolvers`](PromisEBase.md#withresolvers)
