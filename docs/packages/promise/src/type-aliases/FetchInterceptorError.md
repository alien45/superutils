# Type Alias: FetchInterceptorError

> **FetchInterceptorError** = [`Interceptor`](Interceptor.md)\<[`FetchError`](../classes/FetchError.md), \[\]\>

Defined in: [packages/promise/src/types/fetch.ts:73](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/promise/src/types/fetch.ts#L73)

Fetch error interceptor to be invoked whenever an exception occurs.
This interceptor can also be used as the error transformer by returning [FetchError](../classes/FetchError.md).

## Param

custom error that also contain URL, options & response

## Returns

returning undefined or not returning anything will not override the error

Examples:
---

## Examples

```typescript
import PromisE from '@utiils/promise'

// not returning anything or returning undefined will avoid transforming the error.
const logError = fetchErr => console.log(fetchErr)
const result = await PromisE.fetch('https://my.domain.com/api/that/fails', {
    interceptors: {
        error: [logError]
    }
})
```

```typescript
import PromisE from '@utiils/promise'

// Interceptors can be async functions or just return a promise that resolves to the error.
// If the execution of the interceptor fails or promise rejects, it will be ignored.
// To transform the error it must directly return an error or a Promise that `resolves` with an error.
const transformError = async fetchErr => {
    fetchErr.message = 'Custom errormessage'
	   return Promise.resolve(fetchErr)
}
const result = await PromisE.fetch('https://my.domain.com/api/that/fails', {
    interceptors: {
        error: [transformError]
    }
})
```
