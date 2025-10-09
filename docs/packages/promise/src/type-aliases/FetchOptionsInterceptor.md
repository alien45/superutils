# Type Alias: FetchOptionsInterceptor

> **FetchOptionsInterceptor** = `Omit`\<[`FetchOptions`](FetchOptions.md), `"as"` \| `"errMsgs"` \| `"interceptors"` \| `"headers"` \| keyof [`FetchRetryConf`](FetchRetryConf.md)\> & `object` & `Required`\<[`FetchRetryConf`](FetchRetryConf.md)\>

Defined in: [packages/promise/src/types/fetch.ts:265](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L265)

Fetch options available to interceptors

## Type Declaration

### as

> **as**: [`FetchAs`](../enumerations/FetchAs.md)

### errMsgs

> **errMsgs**: `Required`\<[`FetchErrMsgs`](FetchErrMsgs.md)\>

### headers

> **headers**: `Headers`

### interceptors

> **interceptors**: `Required`\<[`FetchInterceptors`](FetchInterceptors.md)\>
