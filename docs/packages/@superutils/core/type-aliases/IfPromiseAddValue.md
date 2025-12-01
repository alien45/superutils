# Type Alias: IfPromiseAddValue\<T\>

> **IfPromiseAddValue**\<`T`\> = `T` *extends* `Promise`\<infer V\> ? `T` \| `V` : `T`

Defined in: [packages/core/src/fallbackIfFails.ts:6](https://github.com/alien45/utiils/blob/d7177c2d4cc6f77ae68ce7eb97309af0bd9e2f3f/packages/core/src/fallbackIfFails.ts#L6)

If `T` is a promise turn it into an union type by adding the value type

## Type Parameters

### T

`T`
