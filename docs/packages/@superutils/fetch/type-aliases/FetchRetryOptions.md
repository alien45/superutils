# Type Alias: FetchRetryOptions

> **FetchRetryOptions** = `Partial`\<`RetryOptions`\> & `object`

Defined in: [packages/fetch/src/types.ts:288](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/fetch/src/types.ts#L288)

Fetch retry options

## Type Declaration

### retry?

> `optional` **retry**: `number`

Maximum number of retries.

The total number of attempts will be `retry + 1`.

Default: `0`
