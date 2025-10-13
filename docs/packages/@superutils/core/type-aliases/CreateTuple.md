# Type Alias: CreateTuple\<T, Length, Output\>

> **CreateTuple**\<`T`, `Length`, `Output`\> = `Output`\[`"length"`\] *extends* `Length` ? `Output` : `CreateTuple`\<`T`, `Length`, \[`...Output`, `T`\]\>

Defined in: [types.ts:23](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/core/src/types.ts#L23)

Create a tuple of specific type with given length
---

## Type Parameters

### T

`T`

### Length

`Length` *extends* `number`

### Output

`Output` *extends* readonly `unknown`[] = \[\]

## Examples

```typescript
type CreatedTuple =  CreateTuple<number, 3>
// Result: [number, number, number]
```

```typescript
type ExtendedTuple = CreateTuple<string, 6, CreatedTuple>
// Result: [number, number, number, string, string, string]
```
