# Function: mergeFetchOptions()

> **mergeFetchOptions**(...`allOptions`): [`FetchOptionsInterceptor`](../type-aliases/FetchOptionsInterceptor.md)

Defined in: [packages/fetch/src/mergeFetchOptions.ts:19](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/fetch/src/mergeFetchOptions.ts#L19)

Merge one or more [FetchOptions](../type-aliases/FetchOptions.md) with global fetch options ([config.fetchOptions](../type-aliases/Config.md)).

Notes:
- [config.fetchOptions](../type-aliases/Config.md) will be added as the base and not necessary to be included
- item properties will be prioritized in the order of sequence they were passed in
- the following properties will be merged
    * `errMsgs`
    * `headers`
    * `interceptors`
- all other properties will simply override previous values

## Parameters

### allOptions

...[`FetchOptions`](../type-aliases/FetchOptions.md)[]

## Returns

[`FetchOptionsInterceptor`](../type-aliases/FetchOptionsInterceptor.md)

combined
