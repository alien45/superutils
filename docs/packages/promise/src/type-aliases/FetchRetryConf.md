# Type Alias: FetchRetryConf

> **FetchRetryConf** = `object`

Defined in: [packages/promise/src/types/fetch.ts:286](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L286)

Fetch options for automatic retry mechanism

## Properties

### retry?

> `optional` **retry**: `number`

Defined in: [packages/promise/src/types/fetch.ts:288](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L288)

Default: 0

***

### retryBackOff?

> `optional` **retryBackOff**: `"exponential"` \| `"linear"`

Defined in: [packages/promise/src/types/fetch.ts:296](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L296)

Accepted values:
- exponential: each subsequent retry delay will be doubled from the last
- linear: fixed delay between retries
Default: 'exponential'

***

### retryDelayJitter?

> `optional` **retryDelayJitter**: `boolean`

Defined in: [packages/promise/src/types/fetch.ts:301](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L301)

Add random delay between 0ms and 100ms to the retry delay
Default: true

***

### retryDelayMs?

> `optional` **retryDelayMs**: `number`

Defined in: [packages/promise/src/types/fetch.ts:289](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L289)
