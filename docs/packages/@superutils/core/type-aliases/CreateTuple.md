# Type Alias: CreateTuple\<T, Length, Output\>

> **CreateTuple**\<`T`, `Length`, `Output`\> = `Output`\[`"length"`\] *extends* `Length` ? `Output` : `CreateTuple`\<`T`, `Length`, \[`...Output`, `T`\]\>

Defined in: [types.ts:23](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/core/src/types.ts#L23)

Create a tuple of specific type with given length
---

## Type Parameters

### T

`T` *extends* `any`

### Length

`Length` *extends* `number`

### Output

`Output` *extends* readonly `any`[] = \[\]

## Examples

```typescript
type CreatedTuple =  CreateTuple<number, 3>
// Result: [number, number, number]
```

```typescript
type ExtendedTuple = CreateTuple<string, 6, CreatedTuple>
// Result: [number, number, number, string, string, string]
```
