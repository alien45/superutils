# Type Alias: CreateTuple\<T, Length, Output\>

> **CreateTuple**\<`T`, `Length`, `Output`\> = `Output`\[`"length"`\] *extends* `Length` ? `Output` : `CreateTuple`\<`T`, `Length`, \[`...Output`, `T`\]\>

Defined in: [packages/core/src/types.ts:23](https://github.com/alien45/utiils/blob/ebe095ec25dfc5260c77dd301b2fa92fe87fde25/packages/core/src/types.ts#L23)

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
