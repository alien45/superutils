# Interface: SubjectLike\<T\>

Defined in: [packages/rx/src/types.ts:2](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/rx/src/types.ts#L2)

## Type Parameters

### T

`T` = `unknown`

## Properties

### next()

> **next**: (`value`) => `void`

Defined in: [packages/rx/src/types.ts:4](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/rx/src/types.ts#L4)

#### Parameters

##### value

`T`

#### Returns

`void`

***

### subscribe()

> **subscribe**: (`next`, ...`args`) => [`SubscriptionLike`](SubscriptionLike.md)

Defined in: [packages/rx/src/types.ts:5](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/rx/src/types.ts#L5)

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

Defined in: [packages/rx/src/types.ts:6](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/rx/src/types.ts#L6)
