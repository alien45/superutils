# Type Alias: KeepFirst\<T\>

> **KeepFirst**\<`T`\> = `T` *extends* readonly \[infer First, `...DropFirst<T>`\] ? \[`First`\] : `never`

Defined in: [types.ts:117](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/core/src/types.ts#L117)

Keep the first item from an array/tuple and drop the rest
---

## Type Parameters

### T

`T` *extends* `any`[]

## Example

```typescript
type MyTuple = [first: string, second: number, third: boolean]
type MyTupleWFirst = KeepFirst<MyTuple> // result: [first: string]
```
