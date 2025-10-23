# Type Alias: FetchInterceptorResult

> **FetchInterceptorResult** = [`Interceptor`](Interceptor.md)\<`unknown`, [`FetchArgsInterceptor`](FetchArgsInterceptor.md)\>

Defined in: [packages/fetch/src/types.ts:209](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/fetch/src/types.ts#L209)

Fetch result interceptor to be invoked before returning parsed fetch result.

Result interceptors are executed ONLY when a result is successfully parsed (as ArrayBuffer, Blob, JSON, Text...).
Result interceptors WILL NOT be executed if:
- return type is set to `Response` by using [FetchAs.response](../enumerations/FetchAs.md#response) in the [FetchOptions.as](FetchConf.md#as)
- exceptions is thrown even before attempting to parse
- parse fails

This interceptor can also be used as a transformer by returns a different/modified result.

## Example

```typescript
import PromisE from '@superutils/promise'

// first transform result by extracting result.data
const extractData = result => result?.data ?? result
// then check convert hexadecimal number to BigInt
const hexToBigInt = data => {
    if (data.hasOwnProperty('balance') && `${data.balance}`.startsWith('0x')) {
         data.balance = BigInt(data.balance)
    }
    return data
}
// then log balance (no transformation)
const logBalance = data => {
    data?.hasOwnProperty('balance') && console.log(data.balance)
}
const data = await PromisE.fetch('https://my.domain.com/api', {
    interceptors: {
        result: [
	           extractData,
	           hexToBigInt,
	           logBalance
	       ]
    }
})
```
