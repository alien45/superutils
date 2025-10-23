# Type Alias: FetchInterceptorRequest

> **FetchInterceptorRequest** = [`Interceptor`](Interceptor.md)\<[`FetchArgs`](FetchArgs.md)\[`0`\], [`FetchArgsInterceptor`](FetchArgsInterceptor.md)\>

Defined in: [packages/fetch/src/types.ts:133](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/fetch/src/types.ts#L133)

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
