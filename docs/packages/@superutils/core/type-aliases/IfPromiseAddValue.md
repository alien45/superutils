# Type Alias: IfPromiseAddValue\<T\>

> **IfPromiseAddValue**\<`T`\> = `T` *extends* `Promise`\<infer V\> ? `T` \| `V` : `T`

Defined in: [fallbackIfFails.ts:6](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/core/src/fallbackIfFails.ts#L6)

If `T` is a promise turn it into an union type by adding the value type

## Type Parameters

### T

`T`
