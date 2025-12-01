# Type Alias: KeepFirstN\<T, N\>

> **KeepFirstN**\<`T`, `N`\> = [`TupleMaxLength`](TupleMaxLength.md)\<`T`\> *extends* `N` ? `T` : `T` *extends* readonly \[`...(infer TWithoutLast)`, `unknown`\] ? `KeepFirstN`\<`TWithoutLast`, `N`\> : `never`

Defined in: [packages/core/src/types.ts:134](https://github.com/alien45/utiils/blob/4acac077d6c90ce235cd4eb775ddbbb207554437/packages/core/src/types.ts#L134)

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
