# Function: subjectAsPromise()

> **subjectAsPromise**\<`T`\>(`subject`, `expectedValue?`, `timeout?`, `timeoutMsg?`): \[`PromisE`\<`T`\>, () => `void`\]

Defined in: [packages/rx/src/subjectAsPromise.ts:34](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/rx/src/subjectAsPromise.ts#L34)

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

\[`PromisE`\<`T`\>, () => `void`\]

will reject with:
                                 - `null` if times out
                                 - `undefined` if

## Name

subjectAsPromise

## Subject

is not a valid RxJS subject like subscribable

----------------------------------------

## Example

```ts
```typescript

// Create an interval runner subject that triggers incremental value every second.
const rxInterval = new IntervalSubject(true, 1000, 1, 1)

// create a promise that only resolves when expected value is received
const [promise, unsubscribe] = subjectAsPromise(rxInterval, 10)
promise.then(value => console.log('Value should be 10', value))
```
```
