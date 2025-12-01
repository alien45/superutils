# Interface: SubjectLike\<T\>

Defined in: [packages/rx/src/types.ts:1](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/rx/src/types.ts#L1)

## Type Parameters

### T

`T` = `unknown`

## Properties

### next()

> **next**: (`value`) => `void`

Defined in: [packages/rx/src/types.ts:3](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/rx/src/types.ts#L3)

#### Parameters

##### value

`T`

#### Returns

`void`

***

### subscribe()

> **subscribe**: (`next`, ...`args`) => [`SubscriptionLike`](SubscriptionLike.md)

Defined in: [packages/rx/src/types.ts:4](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/rx/src/types.ts#L4)

#### Parameters

##### next

(`value`) => `void`

##### args

...`unknown`[]

#### Returns

[`SubscriptionLike`](SubscriptionLike.md)

***

### value?

> `optional` **value**: `T`

Defined in: [packages/rx/src/types.ts:8](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/rx/src/types.ts#L8)
