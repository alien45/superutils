# Type Alias: FetchRetryOptions

> **FetchRetryOptions** = `Partial`\<`RetryOptions`\> & `object`

Defined in: [packages/fetch/src/types.ts:290](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/fetch/src/types.ts#L290)

Fetch retry options

## Type Declaration

### retry?

> `optional` **retry**: `number`

Maximum number of retries.

The total number of attempts will be `retry + 1`.

Default: `0`
