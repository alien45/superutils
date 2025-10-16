# Type Alias: FetchOptionsInterceptor

> **FetchOptionsInterceptor** = `Omit`\<[`FetchOptions`](FetchOptions.md), `"as"` \| `"errMsgs"` \| `"interceptors"` \| `"headers"` \| keyof [`FetchRetryOptions`](FetchRetryOptions.md)\> & `object` & `Required`\<[`FetchRetryOptions`](FetchRetryOptions.md)\>

Defined in: packages/fetch/src/types.ts:263

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
