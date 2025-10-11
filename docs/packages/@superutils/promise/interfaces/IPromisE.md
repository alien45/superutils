# Interface: IPromisE\<T\>

Defined in: [packages/promise/src/types/IPromisE.ts:3](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/IPromisE.ts#L3)

## Extends

- `Promise`\<`T`\>

## Extended by

- [`IPromisE_Delay`](IPromisE_Delay.md)

## Type Parameters

### T

`T` = `unknown`

## Properties

### \[toStringTag\]

> `readonly` **\[toStringTag\]**: `string`

Defined in: node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:176

#### Inherited from

`Promise.[toStringTag]`

***

### onEarlyFinalize

> **onEarlyFinalize**: [`OnEarlyFinalize`](../type-aliases/OnEarlyFinalize.md)\<`T`\>[]

Defined in: [packages/promise/src/types/IPromisE.ts:8](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/IPromisE.ts#L8)

callbacks to be invoked whenever PromisE instance is finalized early using non-static resolve/reject methods

***

### pending

> `readonly` **pending**: `boolean`

Defined in: [packages/promise/src/types/IPromisE.ts:11](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/IPromisE.ts#L11)

Indicates if the promise is still pending/unfinalized

***

### reject()

> **reject**: (`reason`) => `IPromisE`\<`T`\>

Defined in: [packages/promise/src/types/IPromisE.ts:14](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/IPromisE.ts#L14)

Reject pending promise early.

#### Parameters

##### reason

`any`

#### Returns

`IPromisE`\<`T`\>

***

### rejected

> `readonly` **rejected**: `boolean`

Defined in: [packages/promise/src/types/IPromisE.ts:17](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/IPromisE.ts#L17)

Indicates if the promise has been rejected

***

### resolve()

> **resolve**: (`value`) => `IPromisE`\<`T`\>

Defined in: [packages/promise/src/types/IPromisE.ts:20](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/IPromisE.ts#L20)

Resovle pending promise early.

#### Parameters

##### value

`T`

#### Returns

`IPromisE`\<`T`\>

***

### resolved

> `readonly` **resolved**: `boolean`

Defined in: [packages/promise/src/types/IPromisE.ts:23](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/IPromisE.ts#L23)

Indicates if the promise has been resolved

***

### state

> `readonly` **state**: `0` \| `1` \| `2`

Defined in: [packages/promise/src/types/IPromisE.ts:5](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/promise/src/types/IPromisE.ts#L5)

0: pending, 1: resolved, 2: rejected

## Methods

### catch()

> **catch**\<`TResult`\>(`onrejected?`): `Promise`\<`T` \| `TResult`\>

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1564

Attaches a callback for only the rejection of the Promise.

#### Type Parameters

##### TResult

`TResult` = `never`

#### Parameters

##### onrejected?

The callback to execute when the Promise is rejected.

`null` | (`reason`) => `TResult` \| `PromiseLike`\<`TResult`\>

#### Returns

`Promise`\<`T` \| `TResult`\>

A Promise for the completion of the callback.

#### Inherited from

`Promise.catch`

***

### finally()

> **finally**(`onfinally?`): `Promise`\<`T`\>

Defined in: node\_modules/typescript/lib/lib.es2018.promise.d.ts:29

Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
resolved value cannot be modified from the callback.

#### Parameters

##### onfinally?

The callback to execute when the Promise is settled (fulfilled or rejected).

`null` | () => `void`

#### Returns

`Promise`\<`T`\>

A Promise for the completion of the callback.

#### Inherited from

`Promise.finally`

***

### then()

> **then**\<`TResult1`, `TResult2`\>(`onfulfilled?`, `onrejected?`): `Promise`\<`TResult1` \| `TResult2`\>

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1557

Attaches callbacks for the resolution and/or rejection of the Promise.

#### Type Parameters

##### TResult1

`TResult1` = `T`

##### TResult2

`TResult2` = `never`

#### Parameters

##### onfulfilled?

The callback to execute when the Promise is resolved.

`null` | (`value`) => `TResult1` \| `PromiseLike`\<`TResult1`\>

##### onrejected?

The callback to execute when the Promise is rejected.

`null` | (`reason`) => `TResult2` \| `PromiseLike`\<`TResult2`\>

#### Returns

`Promise`\<`TResult1` \| `TResult2`\>

A Promise for the completion of which ever callback is executed.

#### Inherited from

`Promise.then`
