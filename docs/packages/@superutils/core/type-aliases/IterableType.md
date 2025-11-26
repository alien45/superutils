# Type Alias: IterableType\<T, Fallback\>

> **IterableType**\<`T`, `Fallback`\> = `T` *extends* infer V[] ? `V`[] : `T` *extends* `Set`\<infer V\> ? `Set`\<`V`\> : `T` *extends* `Map`\<infer K, infer V\> ? `Map`\<`K`, `V`\> : `Fallback`

Defined in: packages/core/src/iterable/types.ts:10

Return the appropriate type if `Array | Map | Set`

## Type Parameters

### T

`T`

### Fallback

`Fallback` = `T`
