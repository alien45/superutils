# Function: fetcher()

> **fetcher**\<`TJSON`, `TOptions`, `TReturn`\>(`url`, `fetchOptions`): `IPromisE`\<`TReturn`\>

Defined in: [packages/fetch/src/fetch.ts:36](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/fetch/src/fetch.ts#L36)

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

### fetchOptions

`TOptions` & `RequestInit` & [`FetchConf`](../type-aliases/FetchConf.md) & `Partial`\<`RetryOptions`\> & `object` = `...`

## Returns

`IPromisE`\<`TReturn`\>
