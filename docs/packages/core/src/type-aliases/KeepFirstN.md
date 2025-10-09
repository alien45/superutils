# Type Alias: KeepFirstN\<T, N\>

> **KeepFirstN**\<`T`, `N`\> = [`TupleMaxLength`](TupleMaxLength.md)\<`T`\> *extends* `N` ? `T` : `T` *extends* readonly \[`...(infer TWithoutLast)`, `any`\] ? `KeepFirstN`\<`TWithoutLast`, `N`\> : `never`

Defined in: [packages/core/src/types.ts:123](https://github.com/alien45/utiils/blob/de45c1b95dc78ccfe80c316de76f71a068a3e03f/packages/core/src/types.ts#L123)

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
