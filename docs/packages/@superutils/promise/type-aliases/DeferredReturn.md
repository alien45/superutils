# Type Alias: DeferredReturn()\<TArgs\>

> **DeferredReturn**\<`TArgs`\> = \<`TResult`\>(`promise`) => [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

Defined in: [packages/promise/src/types/deferred.ts:9](https://github.com/alien45/utiils/blob/1eb281bb287b81b48f87f780196f814d5c255c8a/packages/promise/src/types/deferred.ts#L9)

Return type of `PromisE.deferred()`

## Type Parameters

### TArgs

`TArgs` *extends* `unknown`[] \| \[\] = \[\]

## Type Parameters

### TResult

`TResult` = `unknown`

## Parameters

### promise

`Promise`\<`TResult`\> | (...`args`) => `Promise`\<`TResult`\>

## Returns

[`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>
