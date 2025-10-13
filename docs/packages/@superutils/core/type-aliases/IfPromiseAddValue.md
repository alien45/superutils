# Type Alias: IfPromiseAddValue\<T\>

> **IfPromiseAddValue**\<`T`\> = `T` *extends* `Promise`\<infer V\> ? `T` \| `V` : `T`

Defined in: [fallbackIfFails.ts:6](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/core/src/fallbackIfFails.ts#L6)

If `T` is a promise turn it into an union type by adding the value type

## Type Parameters

### T

`T`
