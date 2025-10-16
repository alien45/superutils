# Type Alias: FetchConf

> **FetchConf** = `object`

Defined in: packages/fetch/src/types.ts:20

## Properties

### abortCtrl?

> `optional` **abortCtrl**: `AbortController`

Defined in: packages/fetch/src/types.ts:26

***

### as?

> `optional` **as**: [`FetchAs`](../enumerations/FetchAs.md)

Defined in: packages/fetch/src/types.ts:25

Specify how the parse the result. To get raw response use [FetchAs.response](../enumerations/FetchAs.md#response).
Default: 'json'

***

### errMsgs?

> `optional` **errMsgs**: [`FetchErrMsgs`](FetchErrMsgs.md)

Defined in: packages/fetch/src/types.ts:27

***

### interceptors?

> `optional` **interceptors**: [`FetchInterceptors`](FetchInterceptors.md)

Defined in: packages/fetch/src/types.ts:28

***

### timeout?

> `optional` **timeout**: `number`

Defined in: packages/fetch/src/types.ts:30

Request timeout in milliseconds.
