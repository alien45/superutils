# Function: fetch()

> **fetch**\<`TJSON`, `TOptions`, `TReturn`\>(`url`, `options`): `IPromisE`\<`TReturn`\>

Defined in: [packages/fetch/src/fetch.ts:48](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/fetch/src/fetch.ts#L48)

A `fetch()` replacement that simplifies data fetching with automatic JSON parsing, request timeouts, retries,
and powerful interceptors. It also includes deferred and throttled request capabilities for complex asynchronous
control flows.

Will reject promise if response status code is not 2xx (200 <= status < 300).

## Type Parameters

### TJSON

`TJSON` = `unknown`

### TOptions

`TOptions` *extends* [`FetchOptions`](../type-aliases/FetchOptions.md) = [`FetchOptions`](../type-aliases/FetchOptions.md)

### TReturn

`TReturn` = `TOptions`\[`"as"`\] *extends* [`FetchAs`](../enumerations/FetchAs.md) ? [`FetchResult`](../interfaces/FetchResult.md)\<`TJSON`\>\[`any`\[`any`\]\] : `TJSON`

## Parameters

### url

`string` | `URL`

### options

`TOptions` & `RequestInit` & [`FetchConf`](../type-aliases/FetchConf.md) & `Partial`\<`RetryOptions`\> & `object` = `...`

(optional) all built-in `fetch()` options such as "method", "headers" and the additionals below.

## Returns

`IPromisE`\<`TReturn`\>

## Example

```typescript
import { fetch } from '@superutils/fetch'

// no need for `response.json()` or `result.data.theActualData` drilling
fetch('https://dummyjson.com/products/1').then(theActualData => console.log(theActualData))
```
