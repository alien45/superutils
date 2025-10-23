# Type Alias: RetryOptions\<T\>

> **RetryOptions**\<`T`\> = `object`

Defined in: [packages/promise/src/types/retry.ts:2](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/types/retry.ts#L2)

Options for automatic retry mechanism

## Type Parameters

### T

`T` = `unknown`

## Properties

### retry?

> `optional` **retry**: `number`

Defined in: [packages/promise/src/types/retry.ts:10](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/types/retry.ts#L10)

Maximum number of retries.

The total number of attempts will be `retry + 1`.

Default: `1`

***

### retryBackOff?

> `optional` **retryBackOff**: `"exponential"` \| `"linear"`

Defined in: [packages/promise/src/types/retry.ts:17](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/types/retry.ts#L17)

Accepted values:
- exponential: each subsequent retry delay will be doubled from the last
- linear: fixed delay between retries
Default: 'exponential'

***

### retryDelay?

> `optional` **retryDelay**: `number`

Defined in: [packages/promise/src/types/retry.ts:22](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/types/retry.ts#L22)

Delay in milliseconds between retries.
Default: `300`

***

### retryDelayJitter?

> `optional` **retryDelayJitter**: `boolean`

Defined in: [packages/promise/src/types/retry.ts:27](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/types/retry.ts#L27)

Add a random delay between 0ms and `retryDelayJitterMax` to the `retryDelayMs`.
Default: `true`

***

### retryDelayJitterMax?

> `optional` **retryDelayJitterMax**: `number`

Defined in: [packages/promise/src/types/retry.ts:32](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/types/retry.ts#L32)

Maximum delay (in milliseconds) to be used when randomly generating jitter delay duration.
Default: `100`

***

### retryIf?

> `optional` **retryIf**: `null` \| (`prevResult`, `retryCount`) => `boolean`

Defined in: [packages/promise/src/types/retry.ts:37](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/promise/src/types/retry.ts#L37)

Additional condition/function to be used to determine whether function should be retried.
`retryIf` will only be executed when function execution is successful.
