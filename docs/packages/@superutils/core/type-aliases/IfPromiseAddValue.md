# Type Alias: IfPromiseAddValue\<T\>

> **IfPromiseAddValue**\<`T`\> = `T` *extends* `Promise`\<infer V\> ? `T` \| `V` : `T`

Defined in: [packages/core/src/fallbackIfFails.ts:6](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/fallbackIfFails.ts#L6)

If `T` is a promise turn it into an union type by adding the value type

## Type Parameters

### T

`T`
