# Type Alias: KeepFirstN\<T, N\>

> **KeepFirstN**\<`T`, `N`\> = [`TupleMaxLength`](TupleMaxLength.md)\<`T`\> *extends* `N` ? `T` : `T` *extends* readonly \[`...(infer TWithoutLast)`, `any`\] ? `KeepFirstN`\<`TWithoutLast`, `N`\> : `never`

Defined in: [types.ts:133](https://github.com/alien45/utiils/blob/4bd65f5269ee75c06903804f521f23674607b3bf/packages/core/src/types.ts#L133)

Keep first N items from an array/tuple and drop the rest
---

## Type Parameters

### T

`T` *extends* readonly `any`[]

### N

`N` *extends* `number` = `1`

## Example

```typescript
type MyTuple = [first: string, second: number, third: boolean]
type MyTupleWith1st2 = KeepFirstN<MyTuple, 2> // result: [first: string, second: number]
```
