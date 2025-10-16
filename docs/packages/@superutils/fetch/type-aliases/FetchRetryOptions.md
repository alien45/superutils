# Type Alias: FetchRetryOptions

> **FetchRetryOptions** = `Partial`\<`RetryOptions`\> & `object`

Defined in: packages/fetch/src/types.ts:288

Fetch retry options

## Type Declaration

### retry?

> `optional` **retry**: `number`

Maximum number of retries.

The total number of attempts will be `retry + 1`.

Default: `0`
