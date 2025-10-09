# Type Alias: DropLast\<T\>

> **DropLast**\<`T`\> = `T` *extends* \[`...(infer Rest)`, `any`\] ? `Rest` : \[\]

Defined in: [packages/core/src/types.ts:87](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/core/src/types.ts#L87)

Drop the last item from an array/tuple and keep the rest
---

## Type Parameters

### T

`T` *extends* `any`[]

## Example

```typescript
type MyTuple = [first: string, second: number, third: boolean]
type MyTupleWOLast = DropLast<MyTuple> // result: [first: string, second: number]
```
