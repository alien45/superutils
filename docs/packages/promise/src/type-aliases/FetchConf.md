# Type Alias: FetchConf

> **FetchConf** = `object`

Defined in: [packages/promise/src/types/fetch.ts:19](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L19)

## Properties

### abortCtrl?

> `optional` **abortCtrl**: `AbortController`

Defined in: [packages/promise/src/types/fetch.ts:25](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L25)

***

### as?

> `optional` **as**: [`FetchAs`](../enumerations/FetchAs.md)

Defined in: [packages/promise/src/types/fetch.ts:24](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L24)

Specify how the parse the result. To get raw response use [FetchAs.response](../enumerations/FetchAs.md#response).
Default: 'json'

***

### errMsgs?

> `optional` **errMsgs**: [`FetchErrMsgs`](FetchErrMsgs.md)

Defined in: [packages/promise/src/types/fetch.ts:26](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L26)

***

### interceptors?

> `optional` **interceptors**: [`FetchInterceptors`](FetchInterceptors.md)

Defined in: [packages/promise/src/types/fetch.ts:27](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L27)

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/promise/src/types/fetch.ts:29](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L29)

Request timeout in milliseconds.
