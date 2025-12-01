# Type Alias: FetchRetryOptions

> **FetchRetryOptions** = `Partial`\<`RetryOptions`\> & `object`

Defined in: [packages/fetch/src/types.ts:290](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/fetch/src/types.ts#L290)

Fetch retry options

## Type Declaration

### retry?

> `optional` **retry**: `number`

Maximum number of retries.

The total number of attempts will be `retry + 1`.

Default: `0`
