# Interface: SubjectLike\<T\>

Defined in: [packages/rx/src/types.ts:1](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/rx/src/types.ts#L1)

## Type Parameters

### T

`T` = `unknown`

## Properties

### next()

> **next**: (`value`) => `void`

Defined in: [packages/rx/src/types.ts:3](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/rx/src/types.ts#L3)

#### Parameters

##### value

`T`

#### Returns

`void`

***

### subscribe()

> **subscribe**: (`next`, ...`args`) => [`SubscriptionLike`](SubscriptionLike.md)

Defined in: [packages/rx/src/types.ts:4](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/rx/src/types.ts#L4)

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

Defined in: [packages/rx/src/types.ts:8](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/rx/src/types.ts#L8)
