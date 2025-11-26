# Type Alias: IfPromiseAddValue\<T\>

> **IfPromiseAddValue**\<`T`\> = `T` *extends* `Promise`\<infer V\> ? `T` \| `V` : `T`

Defined in: [packages/core/src/fallbackIfFails.ts:6](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/fallbackIfFails.ts#L6)

If `T` is a promise turn it into an union type by adding the value type

## Type Parameters

### T

`T`
