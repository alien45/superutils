# Type Alias: KeepFirstN\<T, N\>

> **KeepFirstN**\<`T`, `N`\> = [`TupleMaxLength`](TupleMaxLength.md)\<`T`\> *extends* `N` ? `T` : `T` *extends* readonly \[`...(infer TWithoutLast)`, `unknown`\] ? `KeepFirstN`\<`TWithoutLast`, `N`\> : `never`

Defined in: [types.ts:134](https://github.com/alien45/utiils/blob/d8cbf85643193fc38981e916de5a12980a448b2c/packages/core/src/types.ts#L134)

Keep first N items from an array/tuple and drop the rest
---

## Type Parameters

### T

`T` *extends* readonly `unknown`[]

### N

`N` *extends* `number` = `1`

## Example

```typescript
type MyTuple = [first: string, second: number, third: boolean]
type MyTupleWith1st2 = KeepFirstN<MyTuple, 2> // result: [first: string, second: number]
```
