# Interface: SubjectLike\<T\>

Defined in: [packages/rx/src/types.ts:2](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/rx/src/types.ts#L2)

## Type Parameters

### T

`T` = `unknown`

## Properties

### next()

> **next**: (`value`) => `void`

Defined in: [packages/rx/src/types.ts:4](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/rx/src/types.ts#L4)

#### Parameters

##### value

`T`

#### Returns

`void`

***

### subscribe()

> **subscribe**: (`next`, ...`args`) => [`SubscriptionLike`](SubscriptionLike.md)

Defined in: [packages/rx/src/types.ts:5](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/rx/src/types.ts#L5)

#### Parameters

##### next

(`value`) => `void`

##### args

...`any`[]

#### Returns

[`SubscriptionLike`](SubscriptionLike.md)

***

### value

> **value**: `T`

Defined in: [packages/rx/src/types.ts:6](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/rx/src/types.ts#L6)
