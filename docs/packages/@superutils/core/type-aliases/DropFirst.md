# Type Alias: DropFirst\<T\>

> **DropFirst**\<`T`\> = `T` *extends* \[`unknown`, `...(infer Rest)`\] ? `Rest` : \[\]

Defined in: [packages/core/src/types.ts:65](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/types.ts#L65)

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
