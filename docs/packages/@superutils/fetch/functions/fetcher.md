# Function: fetcher()

> **fetcher**\<`TJSON`, `TOptions`, `TReturn`\>(`url`, `fetchOptions`): `IPromisE`\<`TReturn`\>

Defined in: [packages/fetch/src/fetch.ts:36](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/fetch/src/fetch.ts#L36)

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
