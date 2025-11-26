# Type Alias: DropLast\<T\>

> **DropLast**\<`T`\> = `T` *extends* \[`...(infer Rest)`, `unknown`\] ? `Rest` : \[\]

Defined in: [packages/core/src/types.ts:97](https://github.com/alien45/utiils/blob/73c1a330ca693d319e11ae981651ae1f5cdff43e/packages/core/src/types.ts#L97)

Drop the last item from an array/tuple and keep the rest
---

## Type Parameters

### T

`T` *extends* `unknown`[]

## Example

```typescript
type MyTuple = [first: string, second: number, third: boolean]
type MyTupleWOLast = DropLast<MyTuple> // result: [first: string, second: number]
```
