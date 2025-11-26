# Type Alias: FetchOptionsInterceptor

> **FetchOptionsInterceptor** = `Omit`\<[`FetchOptions`](FetchOptions.md), `"as"` \| `"errMsgs"` \| `"interceptors"` \| `"headers"` \| keyof [`FetchRetryOptions`](FetchRetryOptions.md)\> & `object` & `Required`\<[`FetchRetryOptions`](FetchRetryOptions.md)\>

Defined in: [packages/fetch/src/types.ts:263](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/fetch/src/types.ts#L263)

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
