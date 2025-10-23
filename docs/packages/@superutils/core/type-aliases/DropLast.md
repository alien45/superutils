# Type Alias: DropLast\<T\>

> **DropLast**\<`T`\> = `T` *extends* \[`...(infer Rest)`, `unknown`\] ? `Rest` : \[\]

Defined in: [types.ts:97](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/core/src/types.ts#L97)

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
