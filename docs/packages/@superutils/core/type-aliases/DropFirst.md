# Type Alias: DropFirst\<T\>

> **DropFirst**\<`T`\> = `T` *extends* \[`any`, `...(infer Rest)`\] ? `Rest` : \[\]

Defined in: [types.ts:65](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/core/src/types.ts#L65)

Drop the first item from an array/tuple and keep the rest
---

## Type Parameters

### T

`T` *extends* `any`[]

## Example

```typescript
type MyTuple = [first: string, second: number, third: boolean]
type MyTupleWOFirst = DropFirst<MyTuple> // result: [second: number, third: boolean]
```
