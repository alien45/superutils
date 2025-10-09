# Type Alias: FetchInterceptorRequest

> **FetchInterceptorRequest** = [`Interceptor`](Interceptor.md)\<[`FetchArgs`](FetchArgs.md)\[`0`\], [`FetchArgsInterceptor`](FetchArgsInterceptor.md)\>

Defined in: [packages/promise/src/types/fetch.ts:100](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L100)

Fetch request interceptor to be invoked before making a fetch request.
This interceptor can also be used as a transformer:
1. by returning an API URL (string/URL)
2. by modifying the properties of the options object to be used before making the fetch request

Example:
---

## Example

```typescript
import PromisE from '@utiils/promise'

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
