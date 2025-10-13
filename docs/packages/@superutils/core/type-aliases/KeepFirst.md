# Type Alias: KeepFirst\<T\>

> **KeepFirst**\<`T`\> = `T` *extends* readonly \[infer First, `...DropFirst<T>`\] ? \[`First`\] : `never`

Defined in: [types.ts:118](https://github.com/alien45/utiils/blob/4f8c9f11b4207d2ca8ad6a0057e2e74ff3a15365/packages/core/src/types.ts#L118)

Keep the first item from an array/tuple and drop the rest
---

## Type Parameters

### T

`T` *extends* `unknown`[]

## Example

```typescript
type MyTuple = [first: string, second: number, third: boolean]
type MyTupleWFirst = KeepFirst<MyTuple> // result: [first: string]
```
