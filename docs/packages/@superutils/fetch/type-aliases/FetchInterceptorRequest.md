# Type Alias: FetchInterceptorRequest

> **FetchInterceptorRequest** = [`Interceptor`](Interceptor.md)\<[`FetchArgs`](FetchArgs.md)\[`0`\], [`FetchArgsInterceptor`](FetchArgsInterceptor.md)\>

Defined in: [packages/fetch/src/types.ts:134](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/fetch/src/types.ts#L134)

Fetch request interceptor to be invoked before making a fetch request.
This interceptor can also be used as a transformer:
1. by returning an API URL (string/URL)
2. by modifying the properties of the options object to be used before making the fetch request

## Example

```typescript
import PromisE from '@superutils/promise'

// update API version number
const apiV1ToV2 = url => `${url}`.replace('api/v1', 'api/v2')
const includeAuthToken = (url, options) => {
    options.headers.set('x-auth-token', 'my-auth-token')
}
const data = await PromisE.fetch('https://my.domain.com/api', {
    interceptors: {
        result: [apiV1ToV2, includeAuthToken]
    }
})
```
