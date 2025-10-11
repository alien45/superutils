# Type Alias: IPromisE\_Timeout\<T\>

> **IPromisE\_Timeout**\<`T`\> = [`IPromisE`](../interfaces/IPromisE.md)\<`T`\> & `object`

Defined in: [packages/promise/src/types/IPromisE.ts:79](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/IPromisE.ts#L79)

Descibes a timeout PromisE and it's additional properties.

## Type Declaration

### clearTimeout()

> **clearTimeout**: () => `void`

Clearing the timeout will prevent it from timing out

#### Returns

`void`

### data

> **data**: [`IPromisE`](../interfaces/IPromisE.md)\<`T`\>

The result/data promise. If more than one supplied in `args` result promise will be a combined `PromisE.all`

### timedout

> `readonly` **timedout**: `boolean`

A shorthand getter to check if the promise has timed out. Same as `promise.timeout.rejected`.

### timeout

> **timeout**: [`IPromisE_Delay`](../interfaces/IPromisE_Delay.md)\<`T`\>

The timeout promise

## Type Parameters

### T

`T` = `unknown`
