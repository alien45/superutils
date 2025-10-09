# Type Alias: FetchInterceptorResponse

> **FetchInterceptorResponse** = [`Interceptor`](Interceptor.md)\<`Response`, [`FetchArgsInterceptor`](FetchArgsInterceptor.md)\>

Defined in: [packages/promise/src/types/fetch.ts:132](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L132)

Fetch response interceptor to be invoked before making a fetch request.

This interceptor can also be used as a transformer by return a different/modified Response.

Example
---

## Example

```typescript
import PromisE from '@utiils/promise'

// After successful login, retrieve user balance.
// This is probably better suited as a result transformer but play along as this is
// just a hypothetical scenario ;)
const includeBalance = async response => {
    const balance = await PromisE.fetch('https://my.domain.com/api/user/12325345/balance')
	   const user = await response.json()
    user.balance = balance
    return new Response(JSON.stringify(user))
}
const user = await PromisE.fetch('https://my.domain.com/api/login', {
    interceptors: {
        response: [includeBalance]
    }
})
```
