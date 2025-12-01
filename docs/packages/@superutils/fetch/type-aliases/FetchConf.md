# Type Alias: FetchConf

> **FetchConf** = `object`

Defined in: [packages/fetch/src/types.ts:21](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/fetch/src/types.ts#L21)

## Properties

### abortCtrl?

> `optional` **abortCtrl**: `AbortController`

Defined in: [packages/fetch/src/types.ts:27](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/fetch/src/types.ts#L27)

***

### as?

> `optional` **as**: [`FetchAs`](../enumerations/FetchAs.md)

Defined in: [packages/fetch/src/types.ts:26](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/fetch/src/types.ts#L26)

Specify how the parse the result. To get raw response use [FetchAs.response](../enumerations/FetchAs.md#response).
Default: 'json'

***

### errMsgs?

> `optional` **errMsgs**: [`FetchErrMsgs`](FetchErrMsgs.md)

Defined in: [packages/fetch/src/types.ts:28](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/fetch/src/types.ts#L28)

***

### interceptors?

> `optional` **interceptors**: [`FetchInterceptors`](FetchInterceptors.md)

Defined in: [packages/fetch/src/types.ts:29](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/fetch/src/types.ts#L29)

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/fetch/src/types.ts:31](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/fetch/src/types.ts#L31)

Request timeout in milliseconds.
