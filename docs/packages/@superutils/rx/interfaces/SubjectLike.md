# Interface: SubjectLike\<T\>

Defined in: [packages/rx/src/types.ts:1](https://github.com/alien45/utiils/blob/1eb281bb287b81b48f87f780196f814d5c255c8a/packages/rx/src/types.ts#L1)

## Type Parameters

### T

`T` = `unknown`

## Properties

### next()

> **next**: (`value`) => `void`

Defined in: [packages/rx/src/types.ts:3](https://github.com/alien45/utiils/blob/1eb281bb287b81b48f87f780196f814d5c255c8a/packages/rx/src/types.ts#L3)

#### Parameters

##### value

`T`

#### Returns

`void`

***

### subscribe()

> **subscribe**: (`next`, ...`args`) => [`SubscriptionLike`](SubscriptionLike.md)

Defined in: [packages/rx/src/types.ts:4](https://github.com/alien45/utiils/blob/1eb281bb287b81b48f87f780196f814d5c255c8a/packages/rx/src/types.ts#L4)

#### Parameters

##### next

(`value`) => `void`

##### args

...`unknown`[]

#### Returns

[`SubscriptionLike`](SubscriptionLike.md)

***

### value

> **value**: `T`

Defined in: [packages/rx/src/types.ts:8](https://github.com/alien45/utiils/blob/1eb281bb287b81b48f87f780196f814d5c255c8a/packages/rx/src/types.ts#L8)
