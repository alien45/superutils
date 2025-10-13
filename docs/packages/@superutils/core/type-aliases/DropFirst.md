# Type Alias: DropFirst\<T\>

> **DropFirst**\<`T`\> = `T` *extends* \[`unknown`, `...(infer Rest)`\] ? `Rest` : \[\]

Defined in: [types.ts:65](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/core/src/types.ts#L65)

Drop the first item from an array/tuple and keep the rest
---

## Type Parameters

### T

`T` *extends* `unknown`[]

## Example

```typescript
type MyTuple = [first: string, second: number, third: boolean]
type MyTupleWOFirst = DropFirst<MyTuple> // result: [second: number, third: boolean]
```
