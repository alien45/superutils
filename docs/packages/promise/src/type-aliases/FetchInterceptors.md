# Type Alias: FetchInterceptors

> **FetchInterceptors** = `object`

Defined in: [packages/promise/src/types/fetch.ts:218](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L218)

All valid interceptors for fetch requests are:
---
1. error,
2. request
3. response
4. result.

An interceptor can be any of the following:
---
1. synchronous function
2. synchronous function that returns a promise (or sometimes returns a promise)
3. asynchronous functions

An interceptor can return:
---
1. undefined (void/no return): plain interceptor that does other stuff but does not transform
2. value: act as a transformer. Returned value depends on the type of interceptor.
3. promise resolves with (1) value or (2) undefined

PS:
---
1. Any exception thrown by interceptors will gracefully ignored.
2. Interceptors will be executed in the sequence they're given.
3. Execution priority: global interceprors will always be executed before local interceptors.

More info & examples:
---
See the following for more details and examples:

- `error`: [FetchInterceptorError](FetchInterceptorError.md)
- `request`: [FetchInterceptorRequest](FetchInterceptorRequest.md)
- `response`: [FetchInterceptorResponse](FetchInterceptorResponse.md)
- `result`: [FetchInterceptorResult](FetchInterceptorResult.md)

## Properties

### error?

> `optional` **error**: [`FetchInterceptorError`](FetchInterceptorError.md)[]

Defined in: [packages/promise/src/types/fetch.ts:219](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L219)

***

### request?

> `optional` **request**: [`FetchInterceptorRequest`](FetchInterceptorRequest.md)[]

Defined in: [packages/promise/src/types/fetch.ts:220](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L220)

***

### response?

> `optional` **response**: [`FetchInterceptorResponse`](FetchInterceptorResponse.md)[]

Defined in: [packages/promise/src/types/fetch.ts:221](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L221)

***

### result?

> `optional` **result**: [`FetchInterceptorResult`](FetchInterceptorResult.md)[]

Defined in: [packages/promise/src/types/fetch.ts:222](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L222)
