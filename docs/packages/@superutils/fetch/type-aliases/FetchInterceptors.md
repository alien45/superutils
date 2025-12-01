# Type Alias: FetchInterceptors

> **FetchInterceptors** = `object`

Defined in: [packages/fetch/src/types.ts:249](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/fetch/src/types.ts#L249)

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

Defined in: [packages/fetch/src/types.ts:250](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/fetch/src/types.ts#L250)

***

### request?

> `optional` **request**: [`FetchInterceptorRequest`](FetchInterceptorRequest.md)[]

Defined in: [packages/fetch/src/types.ts:251](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/fetch/src/types.ts#L251)

***

### response?

> `optional` **response**: [`FetchInterceptorResponse`](FetchInterceptorResponse.md)[]

Defined in: [packages/fetch/src/types.ts:252](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/fetch/src/types.ts#L252)

***

### result?

> `optional` **result**: [`FetchInterceptorResult`](FetchInterceptorResult.md)[]

Defined in: [packages/fetch/src/types.ts:253](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/fetch/src/types.ts#L253)
