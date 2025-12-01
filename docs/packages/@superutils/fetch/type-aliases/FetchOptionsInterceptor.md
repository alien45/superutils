# Type Alias: FetchOptionsInterceptor

> **FetchOptionsInterceptor** = `Omit`\<[`FetchOptions`](FetchOptions.md), `"as"` \| `"errMsgs"` \| `"interceptors"` \| `"headers"` \| keyof [`FetchRetryOptions`](FetchRetryOptions.md)\> & `object` & `Required`\<[`FetchRetryOptions`](FetchRetryOptions.md)\>

Defined in: [packages/fetch/src/types.ts:264](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/fetch/src/types.ts#L264)

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
