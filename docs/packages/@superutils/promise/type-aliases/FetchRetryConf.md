# Type Alias: FetchRetryConf

> **FetchRetryConf** = `object`

Defined in: [packages/promise/src/types/fetch.ts:284](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/fetch.ts#L284)

Fetch options for automatic retry mechanism

## Properties

### retry?

> `optional` **retry**: `number`

Defined in: [packages/promise/src/types/fetch.ts:286](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/fetch.ts#L286)

Default: 0

***

### retryBackOff?

> `optional` **retryBackOff**: `"exponential"` \| `"linear"`

Defined in: [packages/promise/src/types/fetch.ts:294](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/fetch.ts#L294)

Accepted values:
- exponential: each subsequent retry delay will be doubled from the last
- linear: fixed delay between retries
Default: 'exponential'

***

### retryDelayJitter?

> `optional` **retryDelayJitter**: `boolean`

Defined in: [packages/promise/src/types/fetch.ts:299](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/fetch.ts#L299)

Add random delay between 0ms and 100ms to the retry delay
Default: true

***

### retryDelayMs?

> `optional` **retryDelayMs**: `number`

Defined in: [packages/promise/src/types/fetch.ts:287](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/fetch.ts#L287)
