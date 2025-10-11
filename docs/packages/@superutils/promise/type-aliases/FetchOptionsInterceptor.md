# Type Alias: FetchOptionsInterceptor

> **FetchOptionsInterceptor** = `Omit`\<[`FetchOptions`](FetchOptions.md), `"as"` \| `"errMsgs"` \| `"interceptors"` \| `"headers"` \| keyof [`FetchRetryConf`](FetchRetryConf.md)\> & `object` & `Required`\<[`FetchRetryConf`](FetchRetryConf.md)\>

Defined in: [packages/promise/src/types/fetch.ts:263](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/fetch.ts#L263)

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
