# Type Alias: DropFirst\<T\>

> **DropFirst**\<`T`\> = `T` *extends* \[`unknown`, `...(infer Rest)`\] ? `Rest` : \[\]

Defined in: [types.ts:65](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/core/src/types.ts#L65)

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
