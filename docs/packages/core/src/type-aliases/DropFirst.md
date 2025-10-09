# Type Alias: DropFirst\<T\>

> **DropFirst**\<`T`\> = `T` *extends* \[`any`, `...(infer Rest)`\] ? `Rest` : \[\]

Defined in: [packages/core/src/types.ts:55](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/core/src/types.ts#L55)

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
