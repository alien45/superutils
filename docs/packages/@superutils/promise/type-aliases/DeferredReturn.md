# Type Alias: DeferredReturn()\<TArgs\>

> **DeferredReturn**\<`TArgs`\> = \<`TResult`\>(`promise`) => [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

Defined in: [packages/promise/src/types/deferred.ts:9](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/promise/src/types/deferred.ts#L9)

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
