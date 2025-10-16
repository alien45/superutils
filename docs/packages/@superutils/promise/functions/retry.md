# Function: retry()

> **retry**\<`T`\>(`func`, `options?`): `Promise`\<`T`\>

Defined in: packages/promise/src/retry.ts:29

Executes a function and retries it on failure or until a specific condition is met.

The function will be re-executed if:
1. The `func` promise rejects or the function throws an error.
2. The optional `retryIf` function returns `true`.

Retries will stop when the `retry` count is exhausted, or when `func` executes successfully
(resolves without error) AND the `retryIf` (if provided) returns `false`.

## Type Parameters

### T

`T`

The type of the value that the `func` returns/resolves to.

## Parameters

### func

() => [`ValueOrPromise`](../../core/type-aliases/ValueOrPromise.md)\<`T`\>

The function to execute. It can be synchronous or asynchronous.

### options?

[`RetryOptions`](../type-aliases/RetryOptions.md)\<`T`\> = `{}`

(optional) Options for configuring the retry mechanism.

## Returns

`Promise`\<`T`\>

A promise that resolves with the result of the last successful execution of `func`.
If all retries fail (either by throwing an error or by the condition function always returning true),
it resolves with `undefined`. Errors thrown by `func` are caught and handled internally, not re-thrown.
