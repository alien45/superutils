# Function: subjectAsPromise()

> **subjectAsPromise**\<`T`\>(`subject`, `expectedValue?`, `timeout?`, `timeoutMsg?`): readonly \[[`IPromisE`](../../promise/interfaces/IPromisE.md)\<`T`\>, () => `void`\] \| ([`PromisE`](../../promise/classes/PromisE.md)\<`T`\> \| () => `Timeout`)[]

Defined in: [packages/rx/src/subjectAsPromise.ts:32](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/rx/src/subjectAsPromise.ts#L32)

subjectAsPromise

## Type Parameters

### T

`T` = `unknown`

## Parameters

### subject

[`SubjectLike`](../interfaces/SubjectLike.md)\<`T`\>

RxJS subject or similar subscribable

### expectedValue?

(optional) if undefined, will resolve as soon as any value is received.
                     If function, it should return true or false to indicate whether the value should be resolved.

`T` | (`value`) => `boolean`

### timeout?

`number`

(optional) will reject if no value received within given time

### timeoutMsg?

`string` = `'request timed out before an expected value is received'`

(optional) error message to use when times out.
                                             Default: 'Request timed out before an expected value is received'

## Returns

readonly \[[`IPromisE`](../../promise/interfaces/IPromisE.md)\<`T`\>, () => `void`\] \| ([`PromisE`](../../promise/classes/PromisE.md)\<`T`\> \| () => `Timeout`)[]

will reject with:
                                 - `null` if times out
                                 - `undefined` if `subject` is not a valid RxJS subject like subscribable

----------------------------------------

## Example

```typescript
const rxInterval = new IntervalSubject(true, 1000, 1, 1)

// create a promise that only resolves when expected value is received
const [promise, unsubscribe] = subjectAsPromise(rxInterval, 10)
promise.then(value => console.log('Value should be 10', value))
```
