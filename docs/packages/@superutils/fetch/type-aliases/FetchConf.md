# Type Alias: FetchConf

> **FetchConf** = `object`

Defined in: [packages/fetch/src/types.ts:20](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/fetch/src/types.ts#L20)

## Properties

### abortCtrl?

> `optional` **abortCtrl**: `AbortController`

Defined in: [packages/fetch/src/types.ts:26](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/fetch/src/types.ts#L26)

***

### as?

> `optional` **as**: [`FetchAs`](../enumerations/FetchAs.md)

Defined in: [packages/fetch/src/types.ts:25](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/fetch/src/types.ts#L25)

Specify how the parse the result. To get raw response use [FetchAs.response](../enumerations/FetchAs.md#response).
Default: 'json'

***

### errMsgs?

> `optional` **errMsgs**: [`FetchErrMsgs`](FetchErrMsgs.md)

Defined in: [packages/fetch/src/types.ts:27](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/fetch/src/types.ts#L27)

***

### interceptors?

> `optional` **interceptors**: [`FetchInterceptors`](FetchInterceptors.md)

Defined in: [packages/fetch/src/types.ts:28](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/fetch/src/types.ts#L28)

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/fetch/src/types.ts:30](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/fetch/src/types.ts#L30)

Request timeout in milliseconds.
