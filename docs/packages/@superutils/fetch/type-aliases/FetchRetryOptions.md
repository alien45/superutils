# Type Alias: FetchRetryOptions

> **FetchRetryOptions** = `Partial`\<`RetryOptions`\> & `object`

Defined in: [packages/fetch/src/types.ts:288](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/fetch/src/types.ts#L288)

Fetch retry options

## Type Declaration

### retry?

> `optional` **retry**: `number`

Maximum number of retries.

The total number of attempts will be `retry + 1`.

Default: `0`
