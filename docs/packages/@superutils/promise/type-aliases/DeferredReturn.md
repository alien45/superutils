# Type Alias: DeferredReturn()\<TArgs\>

> **DeferredReturn**\<`TArgs`\> = \<`TResult`\>(`promise`) => [`IPromisE`](../interfaces/IPromisE.md)\<`TResult`\>

Defined in: [packages/promise/src/types/deferred.ts:9](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/promise/src/types/deferred.ts#L9)

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
